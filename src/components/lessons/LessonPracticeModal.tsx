import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Animated, Modal, Alert } from 'react-native';
import { Theme } from '../../tokens';
import { IconButton, MaterialIcon, ConnectionBadge, StatusIndicatorBadge, SafeText } from '../../atoms';
import { BodyText } from '../../atoms/text/BodyText';
import { 
  AppBackground, 
  AppHeader, 
  TerminalWorkspace,
  LessonContextHeader,
  TaskBottomSheet
} from '../../components';
import { useTerminalConnection, useLessonsContext } from '../../context';
import type { VimMode } from '../../types';
import { ANSI } from '../../services/terminal';

interface LessonPracticeModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LessonPracticeModal: React.FC<LessonPracticeModalProps> = ({ visible, onClose }) => {
  const { connectionState, outputLines, sendCommand, sendRawKey } = useTerminalConnection();
  const {
    activeLessonData,
    isTaskSheetOpen,
    isValidating,
    lastValidationResult,
    runValidation,
    dismissTaskSheet,
    selectLesson,
  } = useLessonsContext();

  const [inputText, setInputText] = useState('');
  const [vimMode, setVimMode] = useState<VimMode>('NORMAL');
  const [isCtrlActive, setIsCtrlActive] = useState(false);
  const [isAltActive, setIsAltActive] = useState(false);

  // Animation for the Floating Sheet
  const sheetTranslateY = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    Animated.timing(sheetTranslateY, {
      toValue: isTaskSheetOpen ? 0 : 1000,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isTaskSheetOpen, sheetTranslateY]);

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

  const handleInputChange = (text: string) => {
    if (text === '') {
      setInputText('');
      return;
    }

    if (isCtrlActive || isAltActive) {
      const typedChar = text.slice(-1);
      if (isCtrlActive) {
        const char = typedChar.toUpperCase();
        if (char >= 'A' && char <= 'Z') {
          const ctrlSequence = String.fromCharCode(char.charCodeAt(0) - 64);
          sendRawKey(ctrlSequence);
        }
        setIsCtrlActive(false);
      } else if (isAltActive) {
        sendRawKey('\x1b' + typedChar);
        setIsAltActive(false);
      }
      setInputText('');
      return;
    }

    setInputText(text);
  };

  const handleKeyPress = (key: string) => {
    if (key === 'CTRL_TOGGLE') {
      setIsCtrlActive((prev) => !prev);
      setIsAltActive(false);
    } else if (key === 'ALT_TOGGLE') {
      setIsAltActive((prev) => !prev);
      setIsCtrlActive(false);
    } else if (
      key === ANSI.PIPE ||
      key === ANSI.TILDE ||
      key === ANSI.FSLASH ||
      key === ANSI.BSLASH ||
      key === ANSI.AMPERSAND ||
      key === ANSI.SEMICOLON
    ) {
      setInputText((prev) => prev + key);
      setIsCtrlActive(false);
      setIsAltActive(false);
    } else if (
      key === ANSI.CTRL_L ||
      key === ANSI.CTRL_C ||
      key === ANSI.CTRL_D ||
      key === ANSI.CTRL_R
    ) {
      sendRawKey(key);
      setInputText('');
      setIsCtrlActive(false);
      setIsAltActive(false);
    } else {
      sendRawKey(key);
      setIsCtrlActive(false);
      setIsAltActive(false);
    }
  };

  // Check if the last line of outputLines is a shell prompt to render it dynamically in the input field
  const lastLine = outputLines[outputLines.length - 1];
  const isPrompt = lastLine && (lastLine.content.trim().endsWith('$') || lastLine.content.trim().endsWith('#')) && lastLine.content.includes('@');

  const displayLines = isPrompt ? outputLines.slice(0, -1) : outputLines;
  const promptPrefix = isPrompt ? lastLine.content.trim() + ' ' : '$ ';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <AppBackground>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView 
            style={styles.keyboardView} 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            {/* Header */}
            <AppHeader
              title=""
              leftSlot={
                <IconButton 
                  icon={<MaterialIcon name="arrow-back" size={24} color={Theme.colors.text.primary} />}
                  onPress={onClose}
                  style={styles.backButton}
                />
              }
              rightSlot={
                <View style={styles.headerRight}>
                  <ConnectionBadge state={connectionState} style={styles.badge} />
                  <IconButton 
                    icon={<MaterialIcon name="assignment" size={24} color={Theme.colors.text.primary} />}
                    onPress={() => {
                      // Toggle instructions sheet
                      if (isTaskSheetOpen) {
                        dismissTaskSheet();
                      } else if (activeLessonData) {
                        selectLesson(activeLessonData);
                      }
                    }}
                  />
                </View>
              }
            />

            {/* Collapsible Context Header */}
            {activeLessonData && (
              <LessonContextHeader 
                title={activeLessonData.title} 
                progress={activeLessonData.progress} 
              />
            )}

            {/* Main Terminal Workspace */}
            <TerminalWorkspace
              filepath={`/home/lessons/${activeLessonData?.id ?? 'workspace'}`}
              connectionState={connectionState}
              lines={displayLines}
              currentInput={inputText}
              onInputChange={handleInputChange}
              onSubmit={handleSubmitCommand}
              vimMode={vimMode}
              cursorRow={displayLines.length}
              cursorCol={inputText.length + 1}
              onKeyPress={handleKeyPress}
              promptPrefix={promptPrefix}
            />

            {/* Floating Task Bottom Sheet */}
            <TaskBottomSheet
              title="Practice Checklist"
              translateY={sheetTranslateY}
              onClose={dismissTaskSheet}
              onCheck={runValidation}
              onHint={() => Alert.alert('Lesson Hint', activeLessonData?.description || 'Follow instructions and complete command operations.')}
              isChecking={isValidating}
            >
              <View style={styles.sheetBody}>
                <BodyText style={styles.instructionsText}>
                  {activeLessonData?.instructions || 'Execute required validations to pass this lesson.'}
                </BodyText>
                
                {lastValidationResult && (
                  <View style={styles.resultContainer}>
                    <StatusIndicatorBadge 
                      label={lastValidationResult.passed ? 'PASSED' : 'FAILED'} 
                      variant={lastValidationResult.passed ? 'success' : 'error'} 
                      style={styles.badgeMargin}
                    />
                    <SafeText style={[
                      styles.resultOutput,
                      lastValidationResult.passed ? styles.textSuccess : styles.textError
                    ]} numberOfLines={3}>
                      {lastValidationResult.output}
                    </SafeText>
                  </View>
                )}
              </View>
            </TaskBottomSheet>

          </KeyboardAvoidingView>
        </SafeAreaView>
      </AppBackground>
    </Modal>
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
  backButton: {
    width: Theme.layout.minTouchTarget,
    height: Theme.layout.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    marginRight: Theme.spacing.sm,
  },
  sheetBody: {
    flex: 1,
  },
  instructionsText: {
    color: Theme.colors.text.primary,
    fontSize: Theme.fontSize.bodyMD,
    lineHeight: Theme.lineHeight.normal,
    marginBottom: Theme.spacing.md,
  },
  resultContainer: {
    marginTop: Theme.spacing.sm,
    padding: Theme.spacing.sm,
    backgroundColor: Theme.colors.background.floor,
    borderRadius: Theme.borderRadius.default,
    borderWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
  },
  badgeMargin: {
    alignSelf: 'flex-start',
    marginBottom: Theme.spacing.xs,
  },
  resultOutput: {
    fontFamily: Theme.fontFamily.mono,
    fontSize: Theme.fontSize.codeXS,
    lineHeight: Theme.lineHeight.normal,
  },
  textSuccess: {
    color: Theme.colors.semantic.success,
  },
  textError: {
    color: Theme.colors.semantic.error,
  },
});
