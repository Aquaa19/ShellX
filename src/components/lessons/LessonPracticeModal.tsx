import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Animated, Modal, Alert, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Theme } from '../../tokens';
import { IconButton, MaterialIcon, ConnectionBadge, StatusIndicatorBadge, SafeText, BorderedSurface, SecondaryActionButton, MonoText } from '../../atoms';
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
    completeExerciseLesson,
    deselectLesson,
  } = useLessonsContext();

  const [inputText, setInputText] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'slides' | 'terminal'>('slides');

  const handleClose = () => {
    deselectLesson();
    onClose();
  };

  // Parse slides from instructions
  const rawInstructions = activeLessonData?.instructions || '';
  const slides = rawInstructions
    ? rawInstructions.split(/\r?\n---\r?\n/).map((s) => s.trim()).filter(Boolean)
    : [];

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedQuizOption(null);
    setCurrentSlideIndex(0);
    
    // Automatically default to terminal view if the lesson type is not theory and it doesn't have slides
    const hasSlides = activeLessonData?.instructions ? activeLessonData.instructions.split(/\r?\n---\r?\n/).filter(Boolean).length > 0 : false;
    if (activeLessonData?.type !== 'theory_only' && !hasSlides) {
      setViewMode('terminal');
    } else {
      setViewMode('slides');
    }
  }, [activeLessonData]);
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

  const renderFormattedText = (text: string, baseStyle: any, key?: number) => {
    const parts = text.split('**');
    return (
      <SafeText key={key} style={baseStyle}>
        {parts.map((part, index) => {
          const isBold = index % 2 === 1;
          if (isBold) {
            return (
              <Text
                key={index}
                style={{
                  fontFamily: Theme.fontFamily.sansBold,
                  fontWeight: 'bold',
                }}
              >
                {part}
              </Text>
            );
          }
          return part;
        })}
      </SafeText>
    );
  };

  const renderSlideLine = (line: string, idx: number) => {
    const trimmed = line.trim();
    if (!trimmed) return <View key={idx} style={{ height: 8 }} />;

    if (trimmed.startsWith('# ')) {
      return renderFormattedText(trimmed.replace('# ', ''), styles.slideHeader, idx);
    }
    if (trimmed.startsWith('## ')) {
      return renderFormattedText(trimmed.replace('## ', ''), styles.slideSubHeader, idx);
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const cleanText = trimmed.slice(2);
      return (
        <View key={idx} style={styles.bulletRow}>
          <SafeText style={styles.bulletDot}>•</SafeText>
          {renderFormattedText(cleanText, styles.bulletText)}
        </View>
      );
    }
    if (trimmed.startsWith('```') || trimmed.startsWith('|')) {
      return (
        <MonoText key={idx} size={12} color={Theme.colors.syntax.green} style={styles.monoBlock}>
          {trimmed}
        </MonoText>
      );
    }
    return renderFormattedText(trimmed, styles.paragraphText, idx);
  };

  const currentSlideText = slides[currentSlideIndex] || '';
  const currentSlideLines = currentSlideText.split('\n');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
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
                  onPress={handleClose}
                  style={styles.backButton}
                />
              }
              rightSlot={
                <View style={styles.headerRight}>
                  <ConnectionBadge state={connectionState} style={styles.badge} />
                  <IconButton 
                    icon={<MaterialIcon name="assignment" size={24} color={Theme.colors.text.primary} />}
                    onPress={() => {
                      if (slides.length > 0) {
                        setViewMode(viewMode === 'slides' ? 'terminal' : 'slides');
                      } else {
                        // Toggle instructions sheet
                        if (isTaskSheetOpen) {
                          dismissTaskSheet();
                        } else if (activeLessonData) {
                          selectLesson(activeLessonData);
                        }
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

            {/* Conditional Quiz Workspace vs CLI Terminal Workspace */}
            {activeLessonData?.type === 'exercise' ? (
              <ScrollView contentContainerStyle={styles.quizScrollContent}>
                <BorderedSurface level="default" style={styles.quizCard}>
                  <View style={styles.quizHeader}>
                    <SafeText style={styles.quizProgressText}>
                      Question {currentQuestionIndex + 1} of {activeLessonData.questions?.length || 0}
                    </SafeText>
                    <MonoText size={Theme.fontSize.labelSM} color={Theme.colors.syntax.orange || '#ffb95f'} weight="bold">
                      EXERCISE (MCQ)
                    </MonoText>
                  </View>
                  
                  {activeLessonData.questions && activeLessonData.questions.length > 0 ? (
                    (() => {
                      const q = activeLessonData.questions[currentQuestionIndex];
                      const isLastQuestion = currentQuestionIndex === activeLessonData.questions.length - 1;
                      
                      return (
                        <View style={styles.quizBody}>
                          <SafeText style={styles.quizQuestionText}>
                            {q.question}
                          </SafeText>

                          <View style={styles.quizOptionsList}>
                            {q.options.map((option, idx) => {
                              const isSelected = selectedQuizOption === option;
                              const isCorrect = option === q.answer;
                              const showResult = selectedQuizOption !== null;

                              let optionItemStyle: any = styles.quizOptionItem;
                              let textColor: string = Theme.colors.text.secondary;
                              let radioStyle: any = styles.quizRadioOutline;
                              let innerRadio = null;

                              if (showResult) {
                                if (isCorrect) {
                                  optionItemStyle = [styles.quizOptionItem, styles.quizOptionItemCorrect];
                                  textColor = Theme.colors.syntax.green;
                                  radioStyle = [styles.quizRadioOutline, styles.quizRadioOutlineCorrect];
                                  innerRadio = <View style={styles.quizRadioSelectedCorrect} />;
                                } else if (isSelected) {
                                  optionItemStyle = [styles.quizOptionItem, styles.quizOptionItemIncorrect];
                                  textColor = Theme.colors.semantic.error;
                                  radioStyle = [styles.quizRadioOutline, { borderColor: Theme.colors.semantic.error }];
                                  innerRadio = <View style={styles.quizRadioSelectedIncorrect} />;
                                }
                              }

                              return (
                                <TouchableOpacity 
                                  key={idx}
                                  style={optionItemStyle}
                                  onPress={() => {
                                    if (selectedQuizOption === null) {
                                      setSelectedQuizOption(option);
                                    }
                                  }}
                                  activeOpacity={0.7}
                                  disabled={showResult}
                                >
                                  <View style={radioStyle}>
                                    {innerRadio}
                                  </View>
                                  <MonoText size={Theme.fontSize.codeBase} color={textColor} style={styles.quizOptionCode}>
                                    {option}
                                  </MonoText>
                                </TouchableOpacity>
                              );
                            })}
                          </View>

                          {selectedQuizOption !== null && (
                            <View style={styles.quizExplanationContainer}>
                              <MonoText size={Theme.fontSize.labelSM} color={Theme.colors.syntax.orange || '#ffb95f'} weight="bold" style={styles.quizExplanationTitle}>
                                EXPLANATION:
                              </MonoText>
                              <SafeText style={styles.quizExplanationText}>
                                {q.explanation}
                              </SafeText>
                              
                              <SecondaryActionButton
                                label={isLastQuestion ? "FINISH QUIZ" : "NEXT QUESTION"}
                                onPress={async () => {
                                  if (isLastQuestion) {
                                    await completeExerciseLesson();
                                    handleClose();
                                  } else {
                                    setCurrentQuestionIndex(prev => prev + 1);
                                    setSelectedQuizOption(null);
                                  }
                                }}
                                style={styles.quizNextBtn}
                              />
                            </View>
                          )}
                        </View>
                      );
                    })()
                  ) : (
                    <SafeText style={styles.quizQuestionText}>
                      No quiz questions defined for this exercise.
                    </SafeText>
                  )}
                </BorderedSurface>
              </ScrollView>
            ) : viewMode === 'slides' && slides.length > 0 ? (
              <ScrollView contentContainerStyle={styles.quizScrollContent}>
                <View style={styles.slideCard}>
                  <ScrollView style={styles.slideScroll}>
                    {currentSlideLines.map((line, idx) => renderSlideLine(line, idx))}
                  </ScrollView>
                  
                  <View style={styles.slideFooter}>
                    {currentSlideIndex > 0 ? (
                      <SecondaryActionButton
                        label="BACK"
                        onPress={() => setCurrentSlideIndex(prev => prev - 1)}
                        style={styles.slideNavBtn}
                      />
                    ) : (
                      <View style={{ width: 90 }} />
                    )}
                    
                    <SafeText style={styles.slideProgress}>
                      {currentSlideIndex + 1} / {slides.length}
                    </SafeText>
                    
                    {currentSlideIndex < slides.length - 1 ? (
                      <SecondaryActionButton
                        label="NEXT"
                        onPress={() => setCurrentSlideIndex(prev => prev + 1)}
                        style={styles.slideNavBtn}
                      />
                    ) : (
                      activeLessonData?.type === 'theory_only' ? (
                        <SecondaryActionButton
                          label="COMPLETE"
                          onPress={async () => {
                            await completeExerciseLesson();
                            handleClose();
                          }}
                          style={styles.slideNavBtn}
                        />
                      ) : (
                        <SecondaryActionButton
                          label="PRACTICE"
                          onPress={() => setViewMode('terminal')}
                          style={styles.slideNavBtn}
                        />
                      )
                    )}
                  </View>
                </View>
              </ScrollView>
            ) : (
              <>
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
              </>
            )}

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
  },
  textSuccess: {
    color: Theme.colors.semantic.success,
  },
  textError: {
    color: Theme.colors.semantic.error,
  },
  quizScrollContent: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.xxl,
  },
  quizCard: {
    padding: Theme.spacing.md,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    borderBottomWidth: Theme.borderWidth.hairline,
    borderBottomColor: Theme.colors.border.subtle,
    paddingBottom: Theme.spacing.sm,
  },
  quizProgressText: {
    color: Theme.colors.text.secondary,
    fontFamily: Theme.fontFamily.mono,
    fontSize: Theme.fontSize.labelSM,
  },
  quizBody: {
    marginTop: Theme.spacing.xs,
  },
  quizQuestionText: {
    color: Theme.colors.text.primary,
    fontSize: Theme.fontSize.bodyMD,
    lineHeight: Theme.fontSize.bodyMD * Theme.lineHeight.normal,
    marginBottom: Theme.spacing.lg,
    fontWeight: 'bold',
  },
  quizOptionsList: {
    gap: Theme.spacing.sm,
  },
  quizOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.background.floor,
    borderWidth: 1,
    borderColor: Theme.colors.border.subtle,
    borderRadius: Theme.borderRadius.default,
    minHeight: Theme.layout.minTouchTarget,
  },
  quizOptionItemCorrect: {
    borderColor: Theme.colors.semantic.success,
    backgroundColor: 'rgba(79, 223, 148, 0.04)',
  },
  quizOptionItemIncorrect: {
    borderColor: Theme.colors.semantic.error,
    backgroundColor: 'rgba(255, 107, 107, 0.04)',
  },
  quizRadioOutline: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: Theme.colors.text.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  quizRadioOutlineCorrect: {
    borderColor: Theme.colors.syntax.green,
  },
  quizRadioSelectedCorrect: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Theme.colors.syntax.green,
  },
  quizRadioSelectedIncorrect: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Theme.colors.semantic.error,
  },
  quizOptionCode: {
    flex: 1,
  },
  quizExplanationContainer: {
    marginTop: Theme.spacing.lg,
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.background.floor,
    borderRadius: Theme.borderRadius.default,
    borderWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
  },
  quizExplanationTitle: {
    marginBottom: Theme.spacing.xs,
  },
  quizExplanationText: {
    color: Theme.colors.text.secondary,
    fontSize: Theme.fontSize.bodySM,
    lineHeight: Theme.fontSize.bodySM * Theme.lineHeight.normal,
    marginBottom: Theme.spacing.md,
  },
  quizNextBtn: {
    marginTop: Theme.spacing.sm,
  },
  slideCard: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    borderRadius: Theme.borderRadius.lg,
    borderWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
    padding: Theme.spacing.lg,
    minHeight: 450,
  },
  slideScroll: {
    flex: 1,
    marginBottom: Theme.spacing.md,
  },
  slideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: Theme.borderWidth.hairline,
    borderTopColor: Theme.colors.border.subtle,
    paddingTop: Theme.spacing.md,
    marginTop: 'auto',
  },
  slideProgress: {
    fontFamily: Theme.fontFamily.mono,
    fontSize: Theme.fontSize.labelSM,
    color: Theme.colors.text.tertiary,
  },
  slideNavBtn: {
    minWidth: 90,
  },
  slideHeader: {
    fontSize: Theme.fontSize.titleLG,
    fontFamily: Theme.fontFamily.sansBold,
    color: Theme.colors.syntax.blue || '#3b82f6',
    marginBottom: Theme.spacing.md,
  },
  slideSubHeader: {
    fontSize: Theme.fontSize.titleMD,
    fontFamily: Theme.fontFamily.sansSemiBold,
    color: Theme.colors.syntax.orange || '#ffb95f',
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
    paddingLeft: Theme.spacing.xs,
  },
  bulletDot: {
    fontSize: Theme.fontSize.bodyMD,
    color: Theme.colors.syntax.green || '#34d399',
    marginRight: Theme.spacing.sm,
    lineHeight: Theme.fontSize.bodyMD * Theme.lineHeight.normal,
  },
  bulletText: {
    flex: 1,
    fontSize: Theme.fontSize.bodyMD,
    color: Theme.colors.text.primary,
    lineHeight: Theme.fontSize.bodyMD * Theme.lineHeight.normal,
  },
  paragraphText: {
    fontSize: Theme.fontSize.bodyMD,
    color: Theme.colors.text.secondary,
    lineHeight: Theme.fontSize.bodyMD * Theme.lineHeight.normal,
    marginBottom: Theme.spacing.md,
  },
  monoBlock: {
    backgroundColor: '#1E1E1E',
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.default,
    fontFamily: Theme.fontFamily.mono,
    fontSize: Theme.fontSize.codeSM,
    marginVertical: Theme.spacing.sm,
    borderWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
  },
});
