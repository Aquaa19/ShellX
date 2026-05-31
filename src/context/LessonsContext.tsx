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

  const refreshLessons = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
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
    setIsLoading(false);
  }, [user, activeLessonData]);

  // Initial load
  useEffect(() => {
    if (user) {
      refreshLessons();
    }
  }, [user, refreshLessons]);

  // Subscribe to real-time progress updates for each module
  useEffect(() => {
    if (!user || modules.length === 0) return;

    const unsubscribers = modules.map((m) =>
      LessonService.subscribeToUserProgress(user.uid, m.id, () => {
        // Trigger a background refresh to recalculate unlocked states
        refreshLessons();
      })
    );

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [user, modules, refreshLessons]);

  const selectLesson = useCallback(async (lesson: LessonData) => {
    if (!user) return;
    setActiveLessonData(lesson);
    setLastValidationResult(null);
    setIsTaskSheetOpen(true);

    // Call service layer to mark in progress
    await ProgressService.markLessonInProgress(user.uid, lesson.moduleId, lesson.id);

    // Silently cd to the lesson workspace directory
    try {
      const lessonPath = `/home/${serverConfig.sshUser}/lessons/${lesson.id}`;
      await executeBackgroundCommand(`mkdir -p "${lessonPath}" && cd "${lessonPath}"`);
    } catch (e) {
      console.warn('[LessonsContext] Silent workspace setup cd failed:', e);
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
