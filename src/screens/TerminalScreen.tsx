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
import { MOCK_TERMINAL_LINES } from '../data';
import type { VimMode } from '../components';

export const TerminalScreen: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [vimMode, setVimMode] = useState<VimMode>('NORMAL');
  const [isTaskSheetVisible, setIsTaskSheetVisible] = useState(false);
  const [showLessonContext] = useState(true);
  const [connectionState] = useState<'offline' | 'connected' | 'connecting'>('offline');
  const [isCheckingTask, setIsCheckingTask] = useState(false);

  // Animation for the Bottom Sheet
  const sheetTranslateY = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    Animated.timing(sheetTranslateY, {
      toValue: isTaskSheetVisible ? 0 : 1000,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isTaskSheetVisible, sheetTranslateY]);

  const handleKeyPress = (key: string) => {
    if (key === 'ESC') setVimMode('NORMAL');
    if (key === 'i' || key === 'INSERT') setVimMode('INSERT');
  };

  const handleTaskCheck = () => {
    setIsCheckingTask(true);
    setTimeout(() => setIsCheckingTask(false), 1500); // Mock check
  };

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
            lines={MOCK_TERMINAL_LINES}
            currentInput={inputText}
            onInputChange={setInputText}
            onSubmit={() => setInputText('')}
            vimMode={vimMode}
            cursorRow={12}
            cursorCol={4}
            onKeyPress={handleKeyPress}
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