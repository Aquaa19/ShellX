import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { Theme } from '../tokens';
import { IconButton, MaterialIcon, ConnectionBadge } from '../atoms';
import { 
  AppBackground, 
  AppHeader, 
  ShellXLogoText, 
  TerminalWorkspace,
  LessonContextHeader,
  TaskBottomSheet
} from '../components';
import { useAppContext, useAuthContext, useTerminalConnection } from '../context';
import type { VimMode, LessonData } from '../types';

export const TerminalScreen: React.FC = () => {
  const { user } = useAuthContext();
  const { serverConfig } = useAppContext();
  const {
    connectionState,
    outputLines,
    sendCommand,
    sendRawKey,
    connect,
  } = useTerminalConnection();

  const [inputText, setInputText] = useState('');
  const [vimMode, setVimMode] = useState<VimMode>('NORMAL');
  const [isTaskSheetVisible, setIsTaskSheetVisible] = useState(false);
  const [showLessonContext] = useState(true);
  const [isCheckingTask, setIsCheckingTask] = useState(false);
  // activeLesson populated by LessonsScreen navigation param in Phase 2.5
  const [activeLesson, setActiveLesson] = useState<LessonData | null>(null);

  // Animation for the Bottom Sheet
  const sheetTranslateY = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    Animated.timing(sheetTranslateY, {
      toValue: isTaskSheetVisible ? 0 : 1000,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isTaskSheetVisible, sheetTranslateY]);

  // Initiate connection on mount
  useEffect(() => {
    if (user && serverConfig.ip) {
      connect(serverConfig, user.uid);
    }
  }, [connect, serverConfig, user]);

  // Dynamic Vim mode detection by parsing output lines
  useEffect(() => {
    const last = outputLines[outputLines.length - 1];
    if (!last) return;
    if (last.content.includes('-- INSERT --')) {
      setVimMode('INSERT');
    } else if (last.content.includes('-- VISUAL --')) {
      setVimMode('VISUAL');
    } else if (last.content.includes('-- COMMAND --')) {
      setVimMode('COMMAND');
    } else if (last.type === 'command') {
      setVimMode('NORMAL');
    }
  }, [outputLines]);

  const handleSubmitCommand = () => {
    if (!inputText.trim() && vimMode === 'NORMAL') return;
    sendCommand(inputText);
    setInputText('');
  };

  const handleKeyPress = (key: string) => {
    sendRawKey(key); // key is an ANSI sequence (AnsiSequences.ts)
  };

  const handleTaskCheck = () => {
    setIsCheckingTask(true);
    setTimeout(() => setIsCheckingTask(false), 1500); // Mock check
  };

  // Check if the last line of outputLines is a shell prompt to render it dynamically in the input field
  const lastLine = outputLines[outputLines.length - 1];
  const isPrompt = lastLine && (lastLine.content.trim().endsWith('$') || lastLine.content.trim().endsWith('#')) && lastLine.content.includes('@');

  const displayLines = isPrompt ? outputLines.slice(0, -1) : outputLines;
  const promptPrefix = isPrompt ? lastLine.content.trim() + ' ' : '$ ';

  return (
    <AppBackground>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          style={styles.keyboardView} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Header */}
          <AppHeader
            title=""
            leftSlot={<ShellXLogoText text="ShellX_Terminal" size={Theme.fontSize.titleLG} />}
            rightSlot={
              <View style={styles.headerRight}>
                <ConnectionBadge state={connectionState} style={styles.badge} />
                <IconButton 
                  icon={<MaterialIcon name="menu" size={24} color={Theme.colors.text.primary} />}
                  onPress={() => setIsTaskSheetVisible(!isTaskSheetVisible)}
                />
              </View>
            }
          />

          {/* Collapsible Context Header */}
          {showLessonContext && (
            <LessonContextHeader 
              title="Lesson 4: File Permissions" 
              progress={0.4} 
            />
          )}

          {/* Main Terminal Workspace */}
          <TerminalWorkspace
            filepath="/home/student/project/script.sh"
            connectionState={connectionState}
            lines={displayLines}
            currentInput={inputText}
            onInputChange={setInputText}
            onSubmit={handleSubmitCommand}
            vimMode={vimMode}
            cursorRow={displayLines.length}
            cursorCol={inputText.length + 1}
            onKeyPress={handleKeyPress}
            promptPrefix={promptPrefix}
          />

          {/* Floating Task Bottom Sheet */}
          <TaskBottomSheet
            title="Current Task"
            translateY={sheetTranslateY}
            onClose={() => setIsTaskSheetVisible(false)}
            onCheck={handleTaskCheck}
            onHint={() => console.log('Hint requested')}
            isChecking={isCheckingTask}
          >
            {/* Task content injected here in future phases */}
          </TaskBottomSheet>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background.floor,
  },
  keyboardView: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    marginRight: Theme.spacing.sm,
  },
});