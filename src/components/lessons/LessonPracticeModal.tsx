import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Animated, Modal, Alert, ScrollView, TouchableOpacity, Text, Keyboard } from 'react-native';
import { Theme } from '../../tokens';
import { IconButton, MaterialIcon, ConnectionBadge, StatusIndicatorBadge, SafeText, BorderedSurface, SecondaryActionButton, MonoText, HeadlineText } from '../../atoms';
import { 
  AppBackground, 
  AppHeader, 
  TerminalWorkspace,
  LessonContextHeader,
  TaskSheetActions,
  TerminalFileEditor
} from '../../components';
import { useTerminalConnection, useLessonsContext, useAppContext } from '../../context';
import type { VimMode } from '../../types';
import { ANSI } from '../../services/terminal';

interface LessonPracticeModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LessonPracticeModal: React.FC<LessonPracticeModalProps> = ({ visible, onClose }) => {
  const { connectionState, outputLines, sendCommand, sendRawKey } = useTerminalConnection();
  const { serverConfig } = useAppContext();
  const {
    activeLessonData,
    modules,
    isTaskSheetOpen,
    isValidating,
    lastValidationResult,
    runValidation,
    selectLesson,
    completeExerciseLesson,
    deselectLesson,
  } = useLessonsContext();

  const flatLessons = modules.flatMap((m) => m.lessons);
  const currentLessonIndex = activeLessonData
    ? flatLessons.findIndex((l) => l.id === activeLessonData.id)
    : -1;
  const nextLesson = currentLessonIndex !== -1 && currentLessonIndex < flatLessons.length - 1
    ? flatLessons[currentLessonIndex + 1]
    : null;

  const [inputText, setInputText] = useState('');
  const [inputSelection, setInputSelection] = useState({ start: 0, end: 0 });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [isFileEditorVisible, setIsFileEditorVisible] = useState(false);
  const [editingFilePath, setEditingFilePath] = useState('');

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'slides' | 'terminal'>('slides');

  const [activeTab, setActiveTab] = useState<'terminal' | 'checklist'>('checklist');

  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [hasAlertedTimeOver, setHasAlertedTimeOver] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize and run timer
  useEffect(() => {
    if (visible && activeLessonData) {
      const minutes = activeLessonData.estimatedMinutes || 10;
      const initialSeconds = minutes * 60;
      setTimeLeft(initialSeconds);
      setHasAlertedTimeOver(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const isComplete = activeLessonData.state === 'complete';

      // Only run timer for non-theory lessons that are not yet complete
      if (activeLessonData.type !== 'theory_only' && !isComplete) {
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [visible, activeLessonData?.id, activeLessonData?.state]);

  // Alert when time is over
  useEffect(() => {
    if (timeLeft === 0 && visible && activeLessonData && activeLessonData.type !== 'theory_only' && !hasAlertedTimeOver) {
      setHasAlertedTimeOver(true);
      Alert.alert(
        "Time's Up!",
        "You have run out of the estimated time for this lesson. No pressure! You can take all the time you need to complete the checklist and practice.",
        [{ text: "Continue" }]
      );
    }
  }, [timeLeft, visible, activeLessonData, hasAlertedTimeOver]);

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTabChange = (tab: 'terminal' | 'checklist') => {
    setActiveTab(tab);
    if (tab === 'checklist') {
      Keyboard.dismiss();
    }
  };

  const handleClose = () => {
    deselectLesson();
    onClose();
  };

  // Parse slides from instructions
  const rawInstructions = activeLessonData?.instructions || '';
  const slides = rawInstructions
    ? rawInstructions.split(/\r?\n[ \t]*-{3,}[ \t]*\r?\n/).map((s) => s.trim()).filter(Boolean)
    : [];

  const prevLessonIdRef = useRef<string | null>(null);

  useEffect(() => {
    const currentId = activeLessonData?.id ?? null;
    const hasIdChanged = currentId !== prevLessonIdRef.current;
    prevLessonIdRef.current = currentId;

    if (hasIdChanged) {
      setCurrentQuestionIndex(0);
      setSelectedQuizOption(null);
      setCurrentSlideIndex(0);
      
      // Automatically default to terminal view if the lesson type is not theory and it doesn't have slides
      const hasSlides = activeLessonData?.instructions ? activeLessonData.instructions.split(/\r?\n[ \t]*-{3,}[ \t]*\r?\n/).filter(Boolean).length > 0 : false;
      if (activeLessonData?.type !== 'theory_only' && !hasSlides) {
        setViewMode('terminal');
      } else {
        setViewMode('slides');
      }
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

    const trimmedInput = inputText.trim();
    const parts = trimmedInput.split(/\s+/);
    const commandName = parts[0];

    // Automatically intercept standard editors to open the visual Remote File Editor modal
    if (commandName === 'nano' || commandName === 'edit' || commandName === 'code') {
      const filePathArg = parts.slice(1).join(' ').trim();
      if (filePathArg) {
        let resolvedPath = filePathArg;
        if (!filePathArg.startsWith('/') && !filePathArg.startsWith('~')) {
          const sshUser = serverConfig.sshUser || 'student';
          const activePath = `/home/${sshUser}/lessons/${activeLessonData?.id ?? 'workspace'}`;
          resolvedPath = `${activePath}/${filePathArg}`;
        }
        setEditingFilePath(resolvedPath);
      } else {
        const sshUser = serverConfig.sshUser || 'student';
        const activePath = `/home/${sshUser}/lessons/${activeLessonData?.id ?? 'workspace'}`;
        setEditingFilePath(`${activePath}/file.txt`);
      }
      setIsFileEditorVisible(true);
      setInputText('');
      setInputSelection({ start: 0, end: 0 });
      return;
    }

    sendCommand(inputText);
    setInputText('');
    setInputSelection({ start: 0, end: 0 });
  };

  const handleInputChange = (text: string) => {
    if (text === '') {
      setInputText('');
      setInputSelection({ start: 0, end: 0 });
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
      setInputSelection({ start: 0, end: 0 });
      return;
    }

    setInputText(text);
  };

  const handleSelectionChange = (e: any) => {
    setInputSelection(e.nativeEvent.selection);
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
      setInputSelection({ start: 0, end: 0 });
      setIsCtrlActive(false);
      setIsAltActive(false);
    } else if (key === ANSI.ARROW_LEFT && inputText.length > 0) {
      setInputSelection((prev) => {
        const nextPos = Math.max(0, prev.start - 1);
        return { start: nextPos, end: nextPos };
      });
      setIsCtrlActive(false);
      setIsAltActive(false);
    } else if (key === ANSI.ARROW_RIGHT && inputText.length > 0) {
      setInputSelection((prev) => {
        const nextPos = Math.min(inputText.length, prev.start + 1);
        return { start: nextPos, end: nextPos };
      });
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

  const renderFormattedText = (text: string, baseStyle: any, key?: string | number) => {
    const boldParts = text.split('**');
    return (
      <SafeText key={key} style={baseStyle}>
        {boldParts.map((boldPart, boldIdx) => {
          const isBold = boldIdx % 2 === 1;
          const codeParts = boldPart.split('`');
          const renderedContent = codeParts.map((codePart, codeIdx) => {
            const isCode = codeIdx % 2 === 1;
            if (isCode) {
              return (
                <Text
                  key={`code-${codeIdx}`}
                  style={{
                    fontFamily: Theme.fontFamily.mono || 'monospace',
                    color: Theme.colors.syntax.orange || '#ffb95f',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }}
                >
                  {codePart}
                </Text>
              );
            }
            return codePart;
          });

          if (isBold) {
            return (
              <Text
                key={`bold-${boldIdx}`}
                style={{
                  fontFamily: Theme.fontFamily.sansBold,
                  fontWeight: 'bold',
                }}
              >
                {renderedContent}
              </Text>
            );
          }
          return renderedContent;
        })}
      </SafeText>
    );
  };

  interface ParsedNode {
    type: 'heading1' | 'heading2' | 'bullet' | 'code' | 'table' | 'paragraph' | 'spacer';
    content: string;
    lines?: string[];
    key: string;
  }

  const parseSlideLines = (lines: string[]): ParsedNode[] => {
    const nodes: ParsedNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        nodes.push({ type: 'spacer', content: '', key: `spacer-${i}` });
        i++;
        continue;
      }

      if (trimmed.startsWith('# ')) {
        nodes.push({ type: 'heading1', content: trimmed.replace('# ', ''), key: `h1-${i}` });
        i++;
        continue;
      }
      if (trimmed.startsWith('## ')) {
        nodes.push({ type: 'heading2', content: trimmed.replace('## ', ''), key: `h2-${i}` });
        i++;
        continue;
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        nodes.push({ type: 'bullet', content: trimmed.slice(2), key: `bullet-${i}` });
        i++;
        continue;
      }

      if (trimmed.startsWith('```')) {
        const codeLines: string[] = [];
        let j = i + 1;
        while (j < lines.length && !lines[j].trim().startsWith('```')) {
          codeLines.push(lines[j]);
          j++;
        }
        nodes.push({ type: 'code', lines: codeLines, content: '', key: `code-${i}` });
        i = j < lines.length ? j + 1 : j;
        continue;
      }

      if (trimmed.startsWith('|')) {
        const tableLines: string[] = [];
        let j = i;
        while (j < lines.length && lines[j].trim().startsWith('|')) {
          tableLines.push(lines[j].trim());
          j++;
        }
        nodes.push({ type: 'table', lines: tableLines, content: '', key: `table-${i}` });
        i = j;
        continue;
      }

      nodes.push({ type: 'paragraph', content: trimmed, key: `p-${i}` });
      i++;
    }

    return nodes;
  };

  const parseTableCells = (line: string): string[] => {
    const rawCells = line.split('|').map((c) => c.trim());
    if (rawCells[0] === '') rawCells.shift();
    if (rawCells[rawCells.length - 1] === '') rawCells.pop();
    return rawCells;
  };

  const renderTableNode = (tableLines: string[], nodeKey: string) => {
    const dataLines = tableLines.filter((l) => !l.includes('|-') && !l.includes('| -'));
    if (dataLines.length === 0) return null;

    const headerLine = dataLines[0];
    const headerCols = parseTableCells(headerLine);
    const rowLines = dataLines.slice(1);
    const parsedRows = rowLines.map((row) => parseTableCells(row));

    const colCount = Math.max(headerCols.length, ...parsedRows.map((r) => r.length));

    return (
      <View key={nodeKey} style={styles.tableContainer}>
        <View style={styles.tableHeaderRow}>
          {headerCols.map((col, idx) => {
            const isFirst = idx === 0;
            return (
              <View key={idx} style={[styles.tableCell, isFirst && colCount === 2 ? { width: 90, flex: 0 } : { flex: 1 }]}>
                <MonoText size={12} color={Theme.colors.syntax.blue} weight="bold">
                  {col}
                </MonoText>
              </View>
            );
          })}
        </View>

        {parsedRows.map((row, rowIdx) => (
          <View key={rowIdx} style={[styles.tableRow, rowIdx % 2 === 1 && styles.tableRowAlternating]}>
            {row.map((cell, colIdx) => {
              const isFirst = colIdx === 0;
              return (
                <View key={colIdx} style={[styles.tableCell, isFirst && colCount === 2 ? { width: 90, flex: 0 } : { flex: 1 }]}>
                  {renderFormattedText(cell, styles.tableCellText)}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const renderCodeNode = (codeLines: string[], nodeKey: string) => {
    return (
      <MonoText key={nodeKey} size={12} color={Theme.colors.syntax.green} style={styles.monoBlock}>
        {codeLines.join('\n')}
      </MonoText>
    );
  };

  const renderParsedNode = (node: ParsedNode) => {
    switch (node.type) {
      case 'heading1':
        return renderFormattedText(node.content, styles.slideHeader, node.key);
      case 'heading2':
        return renderFormattedText(node.content, styles.slideSubHeader, node.key);
      case 'bullet':
        return (
          <View key={node.key} style={styles.bulletRow}>
            <SafeText style={styles.bulletDot}>•</SafeText>
            {renderFormattedText(node.content, styles.bulletText)}
          </View>
        );
      case 'code':
        return renderCodeNode(node.lines || [], node.key);
      case 'table':
        return renderTableNode(node.lines || [], node.key);
      case 'paragraph':
        return renderFormattedText(node.content, styles.paragraphText, node.key);
      case 'spacer':
        return <View key={node.key} style={{ height: 8 }} />;
      default:
        return null;
    }
  };

  const currentSlideText = slides[currentSlideIndex] || '';
  const currentSlideLines = currentSlideText.split('\n');
  const parsedNodes = parseSlideLines(currentSlideLines);

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
                  {activeLessonData && activeLessonData.type !== 'theory_only' && (
                    <View style={[styles.timerContainer, timeLeft === 0 && styles.timerWarning]}>
                      <MaterialIcon 
                        name="schedule" 
                        size={16} 
                        color={timeLeft === 0 ? Theme.colors.semantic.error : Theme.colors.syntax.orange} 
                        style={{ marginRight: 4 }} 
                      />
                      <MonoText 
                        size={12} 
                        color={timeLeft === 0 ? Theme.colors.semantic.error : Theme.colors.syntax.orange} 
                        weight="bold"
                      >
                        {formatTime(timeLeft)}
                      </MonoText>
                    </View>
                  )}
                  <ConnectionBadge state={connectionState} style={styles.badge} />
                  <IconButton 
                    icon={<MaterialIcon name="assignment" size={24} color={Theme.colors.text.primary} />}
                    onPress={() => {
                      if (slides.length > 0 && viewMode === 'slides') {
                        setViewMode('terminal');
                        setActiveTab('checklist');
                      } else {
                        const targetTab = activeTab === 'terminal' ? 'checklist' : 'terminal';
                        setActiveTab(targetTab);
                        if (targetTab === 'checklist') {
                          Keyboard.dismiss();
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

            {viewMode === 'terminal' && (
              <View style={styles.tabContainer}>
                <TouchableOpacity 
                  style={[styles.tabButton, activeTab === 'terminal' && styles.activeTabButton]} 
                  onPress={() => handleTabChange('terminal')}
                >
                  <View style={styles.tabContent}>
                    <MaterialIcon 
                      name="code" 
                      size={18} 
                      color={activeTab === 'terminal' ? (Theme.colors.syntax.green || '#34d399') : Theme.colors.text.tertiary} 
                    />
                    <MonoText style={[styles.tabText, activeTab === 'terminal' && styles.activeTabText]}>
                      TERMINAL
                    </MonoText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.tabButton, activeTab === 'checklist' && styles.activeTabButton]} 
                  onPress={() => handleTabChange('checklist')}
                >
                  <View style={styles.tabContent}>
                    <MaterialIcon 
                      name="assignment" 
                      size={18} 
                      color={activeTab === 'checklist' ? (Theme.colors.syntax.green || '#34d399') : Theme.colors.text.tertiary} 
                    />
                    <MonoText style={[styles.tabText, activeTab === 'checklist' && styles.activeTabText]}>
                      CHECKLIST
                    </MonoText>
                  </View>
                </TouchableOpacity>
              </View>
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
                  {activeLessonData?.state === 'complete' && (
                    <View style={styles.completedIndicator}>
                      <MaterialIcon name="check-circle" size={16} color={Theme.colors.semantic.success} />
                      <SafeText style={styles.completedIndicatorText}>Lesson Completed</SafeText>
                    </View>
                  )}

                  <ScrollView style={styles.slideScroll}>
                    {parsedNodes.map((node) => renderParsedNode(node))}
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
                      activeLessonData?.state === 'complete' ? (
                        nextLesson ? (
                          <SecondaryActionButton
                            label="NEXT LESSON"
                            onPress={() => selectLesson(nextLesson)}
                            style={styles.slideNavBtn}
                          />
                        ) : (
                          <SecondaryActionButton
                            label="CLOSE"
                            onPress={handleClose}
                            style={styles.slideNavBtn}
                          />
                        )
                      ) : activeLessonData?.type === 'theory_only' ? (
                        <SecondaryActionButton
                          label="COMPLETE"
                          onPress={async () => {
                            await completeExerciseLesson();
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
              <View style={{ flex: 1 }}>
                {activeTab === 'terminal' ? (
                  <TerminalWorkspace
                    filepath={`/home/lessons/${activeLessonData?.id ?? 'workspace'}`}
                    connectionState={connectionState}
                    lines={displayLines}
                    currentInput={inputText}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmitCommand}
                    vimMode={vimMode}
                    cursorRow={displayLines.length}
                    cursorCol={inputSelection.start + 1}
                    onKeyPress={handleKeyPress}
                    promptPrefix={promptPrefix}
                    bottomPadding={0}
                    selection={inputSelection}
                    onSelectionChange={handleSelectionChange}
                    isCtrlActive={isCtrlActive}
                    isAltActive={isAltActive}
                  />
                ) : (
                  <View style={styles.checklistContainer}>
                    <ScrollView style={styles.checklistScroll} contentContainerStyle={styles.checklistScrollContent} showsVerticalScrollIndicator={true}>
                      <HeadlineText size={Theme.fontSize.titleSM} weight="bold" color={Theme.colors.text.primary} style={styles.checklistTitle}>
                        Practice Checklist
                      </HeadlineText>

                      {renderFormattedText(
                        activeLessonData?.instructions || 'Execute required validations to pass this lesson.',
                        styles.instructionsText
                      )}
                      
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
                          ]}>
                            {lastValidationResult.output}
                          </SafeText>
                        </View>
                      )}
                    </ScrollView>

                    <TaskSheetActions 
                      onCheck={runValidation} 
                      onHint={() => Alert.alert('Lesson Hint', activeLessonData?.description || 'Follow instructions and complete command operations.')} 
                      isChecking={isValidating} 
                      style={styles.checklistActions}
                    />
                  </View>
                )}
              </View>
            )}


            {/* Remote File Editor Modal */}
            <TerminalFileEditor
              visible={isFileEditorVisible}
              onClose={() => setIsFileEditorVisible(false)}
              initialFilePath={editingFilePath}
            />

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
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.default,
    marginRight: Theme.spacing.md,
    borderWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
  },
  timerWarning: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
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
  completedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 223, 148, 0.08)',
    borderColor: Theme.colors.semantic.success,
    borderWidth: Theme.borderWidth.hairline,
    borderRadius: Theme.borderRadius.default,
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
    alignSelf: 'flex-start',
    marginBottom: Theme.spacing.md,
    gap: Theme.spacing.xs,
  },
  completedIndicatorText: {
    color: Theme.colors.semantic.success,
    fontFamily: Theme.fontFamily.monoBold,
    fontSize: Theme.fontSize.labelSM,
    textTransform: 'uppercase',
  },
  tableContainer: {
    borderWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
    borderRadius: Theme.borderRadius.default,
    marginVertical: Theme.spacing.md,
    overflow: 'hidden',
    backgroundColor: '#050505',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#141414',
    borderBottomWidth: Theme.borderWidth.hairline,
    borderBottomColor: Theme.colors.border.strong,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: Theme.borderWidth.hairline,
    borderBottomColor: Theme.colors.border.subtle,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    alignItems: 'center',
  },
  tableRowAlternating: {
    backgroundColor: '#0D0D0D',
  },
  tableCell: {
    paddingRight: Theme.spacing.sm,
  },
  tableCellText: {
    fontSize: 13,
    color: Theme.colors.text.secondary,
    lineHeight: 13 * Theme.lineHeight.normal,
  },
  sheetBodyContent: {
    paddingBottom: Theme.spacing.md,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#090909',
    borderBottomWidth: Theme.borderWidth.hairline,
    borderBottomColor: Theme.colors.border.subtle,
    height: 48,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: Theme.colors.syntax.green || '#34d399',
    backgroundColor: 'rgba(52, 211, 153, 0.02)',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  tabText: {
    fontFamily: Theme.fontFamily.mono,
    fontSize: Theme.fontSize.labelSM,
    color: Theme.colors.text.tertiary,
  },
  activeTabText: {
    color: Theme.colors.syntax.green || '#34d399',
    fontFamily: Theme.fontFamily.monoBold,
    fontWeight: 'bold',
  },
  checklistContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background.floor,
  },
  checklistScroll: {
    flex: 1,
  },
  checklistScrollContent: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.xl,
  },
  checklistTitle: {
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.md,
    borderBottomWidth: Theme.borderWidth.hairline,
    borderBottomColor: Theme.colors.border.subtle,
    paddingBottom: Theme.spacing.sm,
  },
  checklistActions: {
    backgroundColor: Theme.colors.surface.default,
    borderTopWidth: Theme.borderWidth.hairline,
    borderTopColor: Theme.colors.border.subtle,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
});
