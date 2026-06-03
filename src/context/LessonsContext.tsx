import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuthContext } from './AuthContext';
import { useAppContext } from './AppContext';
import { useTerminalConnection } from './TerminalConnectionContext';
import { LessonService, ProgressService } from '../services/lessons';
import { LessonData, LessonModule } from '../types';

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
}

const LessonsContext = createContext<LessonsContextState | null>(null);

export const LessonsContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthContext();
  const { serverConfig } = useAppContext();
  const { sendCommand, outputLines, executeBackgroundCommand } = useTerminalConnection();

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

  // Reactive state for the validation settle timer
  const [validationPromise, setValidationPromise] = useState<{
    resolve: (val: string) => void;
    startLineCount: number;
  } | null>(null);

  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Manage subscription lifecycle refs to prevent duplicate subscription triggers on identical lists
  const unsubscribersRef = useRef<(() => void)[]>([]);
  const subscribedModuleIdsRef = useRef<Set<string>>(new Set());
  const isFirstLoadRef = useRef(true);

  // Monitor outputLines to settle validation command execution output
  useEffect(() => {
    if (validationPromise) {
      if (settleTimerRef.current) {
        clearTimeout(settleTimerRef.current);
      }

      settleTimerRef.current = setTimeout(() => {
        const newLines = outputLinesRef.current.slice(validationPromise.startLineCount);
        const output = newLines.map((l) => l.content).join('\n');
        validationPromise.resolve(output);
        setValidationPromise(null);
      }, 800); // Settle after 800ms of inactivity
    }

    return () => {
      if (settleTimerRef.current) {
        clearTimeout(settleTimerRef.current);
      }
    };
  }, [outputLines, validationPromise]);

  const refreshLessonsSilent = useCallback(async () => {
    if (!user) return;
    const data = await LessonService.fetchLessonModules(user.uid);
    setModules(data);

    // Update activeLessonData with fresh data to sync status changes
    if (activeLessonData) {
      const flatLessons = data.flatMap((m) => m.lessons);
      const updated = flatLessons.find((l) => l.id === activeLessonData.id);
      if (updated) {
        setActiveLessonData(updated);
      }
    }
  }, [user, activeLessonData]);

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
      LessonService.subscribeToUserProgress(user.uid, m.id, () => {
        // Trigger a silent background refresh to recalculate unlocked states
        refreshLessonsSilent();
      })
    );

    subscribedModuleIdsRef.current = new Set(moduleIds);
  }, [user, modules, refreshLessonsSilent]);

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

    // Call service layer to mark in progress
    await ProgressService.markLessonInProgress(user.uid, lesson.moduleId, lesson.id);

    // Silently cd to the lesson workspace directory and write starter files
    try {
      const lessonPath = `/home/${serverConfig.sshUser}/lessons/${lesson.id}`;
      let cmd = `mkdir -p "${lessonPath}"`;

      if (lesson.starterFiles && lesson.starterFiles.length > 0) {
        for (const file of lesson.starterFiles) {
          const b64 = utf8ToBase64(file.content);
          cmd += ` && echo "${b64}" | base64 -d > "${lessonPath}/${file.name}"`;
        }
      }

      cmd += ` && cd "${lessonPath}"`;
      await executeBackgroundCommand(cmd);
    } catch (e) {
      console.warn('[LessonsContext] Silent workspace setup cd/write failed:', e);
    }
  }, [user, serverConfig.sshUser, executeBackgroundCommand]);

  const dismissTaskSheet = useCallback(() => {
    setIsTaskSheetOpen(false);
  }, []);

  const runValidation = useCallback(async () => {
    if (!user || !activeLessonData) return;

    setIsValidating(true);
    setLastValidationResult(null);

    try {
      const startLineCount = outputLinesRef.current.length;

      // Start the observer promise and send command in foreground
      const output = await new Promise<string>((resolve) => {
        setValidationPromise({ resolve, startLineCount });
        sendCommand(activeLessonData.validationCommand);
      });

      // Check if output meets validation expectations
      const passed = output.toLowerCase().includes(activeLessonData.validationExpected.toLowerCase());

      if (passed) {
        // Transaction to complete lesson and update progress
        await ProgressService.markLessonComplete(
          user.uid,
          activeLessonData.moduleId,
          activeLessonData.id,
          output
        );
        setLastValidationResult({ passed: true, output });
        await refreshLessons();
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
  }, [user, activeLessonData, sendCommand, refreshLessons]);

  const completeExerciseLesson = useCallback(async () => {
    if (!user || !activeLessonData) return;
    setIsValidating(true);
    try {
      await ProgressService.markLessonComplete(
        user.uid,
        activeLessonData.moduleId,
        activeLessonData.id,
        'Passed Quiz'
      );
      setLastValidationResult({ passed: true, output: 'Quiz completed successfully!' });
      await refreshLessons();
    } catch (error: any) {
      console.warn('[LessonsContext] Quiz completion failed:', error);
    } finally {
      setIsValidating(false);
    }
  }, [user, activeLessonData, refreshLessons]);

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
