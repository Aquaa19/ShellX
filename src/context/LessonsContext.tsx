import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuthContext } from './AuthContext';
import { useAppContext } from './AppContext';
import { useTerminalConnection } from './TerminalConnectionContext';
import { LessonService, ProgressService, UserModuleProgressDocument } from '../services/lessons';
import { LessonData, LessonModule, LessonState } from '../types';

interface LessonsContextState {
  modules:          LessonModule[];
  isLoading:        boolean;
  activeLessonData: LessonData | null;
  isTaskSheetOpen:  boolean;
  isValidating:     boolean;
  lastValidationResult: { passed: boolean; output: string } | null;
  // Actions
  selectLesson:     (lesson: LessonData) => void;
  dismissTaskSheet: () => void;
  runValidation:    () => Promise<void>;
  refreshLessons:   () => Promise<void>;
  completeExerciseLesson: () => Promise<void>;
  deselectLesson:   () => void;
  resetProgress:    () => Promise<void>;
}

const LessonsContext = createContext<LessonsContextState | null>(null);

export const LessonsContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthContext();
  const { serverConfig } = useAppContext();
  const { sendCommand, outputLines, executeBackgroundCommand, clearOutput } = useTerminalConnection();

  const [modules, setModules] = useState<LessonModule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeLessonData, setActiveLessonData] = useState<LessonData | null>(null);
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [lastValidationResult, setLastValidationResult] = useState<{ passed: boolean; output: string } | null>(null);

  // Keep a ref to outputLines to avoid dependency loops in callbacks
  const outputLinesRef = useRef(outputLines);
  useEffect(() => {
    outputLinesRef.current = outputLines;
  }, [outputLines]);

  // Keep a ref to activeLessonData to avoid infinite re-run loop on refreshLessonsSilent
  const activeLessonDataRef = useRef(activeLessonData);
  useEffect(() => {
    activeLessonDataRef.current = activeLessonData;
  }, [activeLessonData]);

  // Manage subscription lifecycle refs to prevent duplicate subscription triggers on identical lists
  const unsubscribersRef = useRef<(() => void)[]>([]);
  const subscribedModuleIdsRef = useRef<Set<string>>(new Set());

  // Global cache of per-module progress — used to evaluate cross-module state reactively
  const allProgressRef = useRef<Map<string, UserModuleProgressDocument | null>>(new Map());
  const isFirstLoadRef = useRef(true);

  const refreshLessonsSilent = useCallback(async () => {
    if (!user) return;
    const data = await LessonService.fetchLessonModules(user.uid);
    setModules(data);

    // Update activeLessonData with fresh data to sync status changes
    const active = activeLessonDataRef.current;
    if (active) {
      const flatLessons = data.flatMap((m) => m.lessons);
      const updated = flatLessons.find((l) => l.id === active.id);
      if (updated) {
        setActiveLessonData(updated);
      }
    }
  }, [user]);

  const refreshLessons = useCallback(async () => {
    setIsLoading(true);
    const startTime = Date.now();
    await refreshLessonsSilent();

    if (isFirstLoadRef.current) {
      const elapsed = Date.now() - startTime;
      const minimumDelay = 2200; // Let the custom scanner play for ~2.2 seconds on cold startup
      if (elapsed < minimumDelay) {
        await new Promise((resolve) => setTimeout(() => resolve(undefined), minimumDelay - elapsed));
      }
      isFirstLoadRef.current = false;
    }

    setIsLoading(false);
  }, [refreshLessonsSilent]);

  // Initial load
  useEffect(() => {
    if (user) {
      refreshLessons();
    }
  }, [user, refreshLessons]);

  const updateModuleProgressReactively = useCallback(
    (changedModuleId: string, progress: UserModuleProgressDocument | null) => {
      // Update the global progress cache for this module
      allProgressRef.current.set(changedModuleId, progress);

      // Build the global completed set + global in-progress ID across ALL modules
      const globalCompletedIds = new Set<string>();
      let globalInProgressId: string | undefined;

      allProgressRef.current.forEach((p) => {
        (p?.completedLessonIds || []).forEach((id) => globalCompletedIds.add(id));
        if (p?.inProgressLessonId) {
          globalInProgressId = p.inProgressLessonId;
        }
      });

      const hasStartedJourney = globalCompletedIds.size > 0 || !!globalInProgressId;

      // Re-evaluate ALL modules with the global progress context
      setModules((prevModules) =>
        prevModules.map((m) => {
          const updatedLessons = m.lessons.map((l) => {
            let state: LessonState = 'locked';

            if (globalCompletedIds.has(l.id)) {
              state = 'complete';
            } else if (globalInProgressId === l.id) {
              state = 'inProgress';
            } else if (!l.prerequisiteId) {
              state = hasStartedJourney ? 'inProgress' : 'locked';
            } else {
              state = globalCompletedIds.has(l.prerequisiteId) ? 'inProgress' : 'locked';
            }

            const progressVal = state === 'complete' ? 1 : 0;
            return { ...l, state, progress: progressVal };
          });

          return { ...m, lessons: updatedLessons };
        })
      );

      // Also re-evaluate the active lesson if one is open
      setActiveLessonData((prevActive) => {
        if (!prevActive) return prevActive;

        let state: LessonState = 'locked';
        if (globalCompletedIds.has(prevActive.id)) {
          state = 'complete';
        } else if (globalInProgressId === prevActive.id) {
          state = 'inProgress';
        } else if (!prevActive.prerequisiteId) {
          state = hasStartedJourney ? 'inProgress' : 'locked';
        } else {
          state = globalCompletedIds.has(prevActive.prerequisiteId) ? 'inProgress' : 'locked';
        }

        const progressVal = state === 'complete' ? 1 : 0;
        return { ...prevActive, state, progress: progressVal };
      });
    },
    []
  );

  // Subscribe to real-time progress updates for each module (with check-guards to avoid infinite loops)
  useEffect(() => {
    if (!user || modules.length === 0) return;

    const moduleIds = modules.map((m) => m.id);
    const currentSubscribed = subscribedModuleIdsRef.current;
    const hasChanged = moduleIds.length !== currentSubscribed.size ||
      moduleIds.some((id) => !currentSubscribed.has(id));

    if (!hasChanged) return;

    // Unsubscribe from previous modules
    unsubscribersRef.current.forEach((unsub) => unsub());
    unsubscribersRef.current = [];

    // Subscribe to new modules
    unsubscribersRef.current = modules.map((m) =>
      LessonService.subscribeToUserProgress(user.uid, m.id, (progress) => {
        updateModuleProgressReactively(m.id, progress);
      })
    );

    subscribedModuleIdsRef.current = new Set(moduleIds);
  }, [user, modules, updateModuleProgressReactively]);

  // Clean up all subscriptions on unmount or user change
  useEffect(() => {
    return () => {
      unsubscribersRef.current.forEach((unsub) => unsub());
      unsubscribersRef.current = [];
      subscribedModuleIdsRef.current = new Set();
    };
  }, [user]);

  const selectLesson = useCallback(async (lesson: LessonData) => {
    if (!user) return;
    setActiveLessonData(lesson);
    setLastValidationResult(null);
    setIsTaskSheetOpen(true);
    
    // Reset terminal screen history locally for the new lesson workspace
    clearOutput();

    // Call service layer to mark in progress
    await ProgressService.markLessonInProgress(user.uid, lesson.moduleId, lesson.id);

    // Silently cd to the lesson workspace directory and write starter files
    try {
      const lessonPath = `/home/${serverConfig.sshUser}/lessons/${lesson.id}`;
      let cmd = `mkdir -p "${lessonPath}"`;

      if (lesson.starterFiles && lesson.starterFiles.length > 0) {
        for (const file of lesson.starterFiles) {
          if (!file || typeof file.name !== 'string' || typeof file.content !== 'string') {
            continue;
          }
          const b64 = utf8ToBase64(file.content);
          cmd += ` && echo "${b64}" | base64 -d > "${lessonPath}/${file.name}"`;
        }
      }

      cmd += ` && cd "${lessonPath}"`;
      await executeBackgroundCommand(cmd);
    } catch (e) {
      console.warn('[LessonsContext] Silent workspace setup cd/write failed:', e);
    }
  }, [user, serverConfig.sshUser, executeBackgroundCommand, clearOutput]);

  const dismissTaskSheet = useCallback(() => {
    setIsTaskSheetOpen(false);
  }, []);

  const deselectLesson = useCallback(() => {
    setActiveLessonData(null);
    setLastValidationResult(null);
    setIsTaskSheetOpen(false);

    // Silently cd back to the home directory when exiting a lesson context
    const sshUser = serverConfig.sshUser || 'student';
    const homePath = `/home/${sshUser}`;
    executeBackgroundCommand(`cd "${homePath}"`).catch((e) => {
      console.warn('[LessonsContext] Silent exit cd to home failed:', e);
    });
  }, [serverConfig.sshUser, executeBackgroundCommand]);

  const completeLessonOptimistically = useCallback((lessonId: string) => {
    setModules((prevModules) => {
      return prevModules.map((m) => {
        const updatedLessons = m.lessons.map((l) => {
          if (l.id === lessonId) {
            return { ...l, state: 'complete' as const, progress: 1 };
          }
          if (l.state === 'locked' && l.prerequisiteId === lessonId) {
            return { ...l, state: 'inProgress' as const };
          }
          return l;
        });
        return { ...m, lessons: updatedLessons };
      });
    });

    setActiveLessonData((prev) => {
      if (prev && prev.id === lessonId) {
        return { ...prev, state: 'complete' as const, progress: 1 };
      }
      return prev;
    });
  }, []);

  const runValidation = useCallback(async () => {
    if (!user || !activeLessonData) return;

    setIsValidating(true);
    setLastValidationResult(null);

    try {
      // Execute the validation command in the background silently
      const sanitizedCommand = sanitizeValidationCommand(activeLessonData.validationCommand);
      const output = await executeBackgroundCommand(sanitizedCommand);

      // Check if output meets validation expectations
      const outputLinesList = output.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const passed = outputLinesList.some(
        (line) => line.toLowerCase() === activeLessonData.validationExpected.toLowerCase()
      );

      if (passed) {
        // Optimistic local state update first
        completeLessonOptimistically(activeLessonData.id);

        // Transaction to complete lesson and update progress
        await ProgressService.markLessonComplete(
          user.uid,
          activeLessonData.moduleId,
          activeLessonData.id,
          output
        );
        setLastValidationResult({ passed: true, output });
      } else {
        await ProgressService.recordLessonCheckAttempt(
          user.uid,
          activeLessonData.id,
          false,
          output
        );
        setLastValidationResult({ passed: false, output });
      }
    } catch (error: any) {
      console.warn('[LessonsContext] Validation execution failed:', error);
      setLastValidationResult({ passed: false, output: error.message || 'Validation error' });
    } finally {
      setIsValidating(false);
    }
  }, [user, activeLessonData, executeBackgroundCommand, completeLessonOptimistically]);

  const completeExerciseLesson = useCallback(async () => {
    if (!user || !activeLessonData) return;
    setIsValidating(true);
    
    // Optimistic local state update first
    completeLessonOptimistically(activeLessonData.id);

    try {
      await ProgressService.markLessonComplete(
        user.uid,
        activeLessonData.moduleId,
        activeLessonData.id,
        'Passed Quiz'
      );
      setLastValidationResult({ passed: true, output: 'Quiz completed successfully!' });
    } catch (error: any) {
      console.warn('[LessonsContext] Quiz completion failed:', error);
    } finally {
      setIsValidating(false);
    }
  }, [user, activeLessonData, completeLessonOptimistically]);

  const resetProgress = useCallback(async () => {
    if (!user || modules.length === 0) return;
    setIsLoading(true);
    try {
      const moduleIds = modules.map((m) => m.id);
      const lessonIds = modules.flatMap((m) => m.lessons).map((l) => l.id);

      await ProgressService.resetAllProgress(user.uid, moduleIds, lessonIds);

      // Clear the global progress cache so reactive snapshots re-fire with empty state
      allProgressRef.current.clear();

      // Reset local modules list state — all lessons locked
      setModules((prevModules) => {
        return prevModules.map((m) => {
          const updatedLessons = m.lessons.map((l) => {
            return {
              ...l,
              state: 'locked' as const,
              progress: 0,
            };
          });
          return { ...m, lessons: updatedLessons };
        });
      });

      setActiveLessonData(null);
      setLastValidationResult(null);
      setIsTaskSheetOpen(false);

    } catch (error) {
      console.warn('[LessonsContext] Reset progress failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, modules]);

  return (
    <LessonsContext.Provider
      value={{
        modules,
        isLoading,
        activeLessonData,
        isTaskSheetOpen,
        isValidating,
        lastValidationResult,
        selectLesson,
        dismissTaskSheet,
        runValidation,
        refreshLessons,
        completeExerciseLesson,
        deselectLesson,
        resetProgress,
      }}
    >
      {children}
    </LessonsContext.Provider>
  );
};

export const useLessonsContext = () => {
  const context = useContext(LessonsContext);
  if (!context) {
    throw new Error('[useLessonsContext] Must be used within a <LessonsContextProvider>.');
  }
  return context;
};

// Robust self-contained UTF-8 string to base64 encoder to avoid global Buffer/btoa dependency
function utf8ToBase64(str: string): string {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else if (code < 0xd800 || code >= 0xe000) {
      bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    } else {
      i++;
      code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      bytes.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 0x3f),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f)
      );
    }
  }

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;
  while (i < bytes.length) {
    const b1 = bytes[i++];
    const b2 = i < bytes.length ? bytes[i++] : NaN;
    const b3 = i < bytes.length ? bytes[i++] : NaN;

    const enc1 = b1 >> 2;
    const enc2 = ((b1 & 3) << 4) | (isNaN(b2) ? 0 : b2 >> 4);
    const enc3 = isNaN(b2) ? 64 : ((b2 & 15) << 2) | (isNaN(b3) ? 0 : b3 >> 6);
    const enc4 = isNaN(b3) ? 64 : b3 & 63;

    result += chars.charAt(enc1) + chars.charAt(enc2) + chars.charAt(enc3) + chars.charAt(enc4);
  }
  return result;
}

// Automatically correct syntax/parenthesis issues in Firestore-stored validation scripts
function sanitizeValidationCommand(cmd: string): string {
  if (!cmd) return cmd;

  // Step 1: Normalize all literal escaped quotes to unescaped double quotes
  let clean = cmd.replace(/\\"/g, '"');

  // Step 2: Extract and simplify the inner validation command, bypassing the verbose casing wrappers
  const wrapperRegex = /\[\s*"\$\(\s*\(\s*(.+?)\s+&&\s+echo\s+["']?(?:MATCH|OK)["']?\s+\|\|\s+echo\s+["']?(?:NO_MATCH|FAIL)["']?\s*\)\s*\|\s*tr\s+['"]\[:upper:\]['"]\s+['"]\[:lower:\]['"]\s*\)"\s*=\s*["'](?:match|ok)["']\s*\]/gi;

  let sanitized = clean.replace(wrapperRegex, (match, innerScript) => {
    return innerScript.trim();
  });

  return sanitized;
}

