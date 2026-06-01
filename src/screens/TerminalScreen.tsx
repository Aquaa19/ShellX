import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Modal, TouchableOpacity, FlatList } from 'react-native';
import { Theme } from '../tokens';
import { IconButton, MaterialIcon, ConnectionBadge, MonoText } from '../atoms';
import { BodyText } from '../atoms/text/BodyText';
import { 
  AppBackground, 
  AppHeader, 
  ShellXLogoText, 
  TerminalWorkspace,
  TerminalFileEditor,
  ShellXSpinner,
  TrueDarkCanvas,
  ScanlineOverlay,
  DottedGridOverlay
} from '../components';
import { useTerminalConnection, useFileSystemContext } from '../context';
import type { VimMode } from '../types';
import { ANSI } from '../services/terminal';

export const TerminalScreen: React.FC = () => {
  const {
    connectionState,
    outputLines,
    sendCommand,
    sendRawKey,
  } = useTerminalConnection();

  const { selectedPath, rootPath } = useFileSystemContext();

  const [inputText, setInputText] = useState('');
  const [vimMode, setVimMode] = useState<VimMode>('NORMAL');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isFileEditorVisible, setIsFileEditorVisible] = useState(false);
  const [editingFilePath, setEditingFilePath] = useState(selectedPath ?? (rootPath + '/a.txt'));
  const [isCtrlActive, setIsCtrlActive] = useState(false);
  const [isAltActive, setIsAltActive] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);

  // Sync editingFilePath with selected file path from file system tree
  useEffect(() => {
    if (selectedPath) {
      setEditingFilePath(selectedPath);
    }
  }, [selectedPath]);



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
        setEditingFilePath(filePathArg);
      }
      setIsFileEditorVisible(true);
      setInputText('');
      return;
    }

    if (inputText.trim()) {
      setCommandHistory((prev) => {
        if (prev[prev.length - 1] === inputText) return prev;
        return [...prev, inputText];
      });
      setHistoryIndex(-1);
    }

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
    } else if (key === ANSI.ARROW_UP) {
      if (commandHistory.length === 0) return;
      const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInputText(commandHistory[newIndex]);
      setIsCtrlActive(false);
      setIsAltActive(false);
    } else if (key === ANSI.ARROW_DOWN) {
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputText('');
      } else {
        setHistoryIndex(newIndex);
        setInputText(commandHistory[newIndex]);
      }
      setIsCtrlActive(false);
      setIsAltActive(false);
    } else {
      sendRawKey(key);
      setIsCtrlActive(false);
      setIsAltActive(false);
    }
  };


  const handleClearHistory = () => {
    setCommandHistory([]);
    setHistoryIndex(-1);
  };

  // Intercept and filter filesystem request sentinel lines cleanly
  const filteredLines = React.useMemo(() => {
    const result: typeof outputLines = [];
    let inFsBlock = false;
    for (const line of outputLines) {
      const content = line.content;
      if (line.type === 'command' && (content.includes('FS_START:') || content.includes('FS_END:'))) {
        continue;
      }
      if (content.includes('FS_START:')) {
        inFsBlock = true;
        continue;
      }
      if (content.includes('FS_END:')) {
        inFsBlock = false;
        continue;
      }
      if (inFsBlock) {
        continue;
      }
      result.push(line);
    }
    return result;
  }, [outputLines]);

  const lastFilteredLine = filteredLines[filteredLines.length - 1];
  const isPromptFiltered = lastFilteredLine && (lastFilteredLine.content.trim().endsWith('$') || lastFilteredLine.content.trim().endsWith('#')) && lastFilteredLine.content.includes('@');

  const displayLines = isPromptFiltered ? filteredLines.slice(0, -1) : filteredLines;
  const promptPrefix = isPromptFiltered ? lastFilteredLine.content.trim() + ' ' : '$ ';

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
                  onPress={() => setIsMenuVisible(true)}
                />
              </View>
            }
          />

          {/* Main Terminal Workspace */}
          <TerminalWorkspace
            filepath={selectedPath ?? rootPath}
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

          {/* Hamburger Options Menu Modal */}
          <Modal
            visible={isMenuVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsMenuVisible(false)}
          >
            <TouchableOpacity 
              style={styles.menuOverlay} 
              activeOpacity={1} 
              onPress={() => setIsMenuVisible(false)}
            >
              <View style={styles.menuContainer}>
                <View style={styles.menuHeader}>
                  <BodyText size={Theme.fontSize.labelMD} color={Theme.colors.text.secondary}>
                    TERMINAL OPTIONS
                  </BodyText>
                </View>

                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={() => {
                    setIsMenuVisible(false);
                    setIsFileEditorVisible(true);
                  }}
                >
                  <MaterialIcon name="edit" size={20} color={Theme.colors.text.primary} style={styles.menuItemIcon} />
                  <BodyText size={Theme.fontSize.bodyMD} color={Theme.colors.text.primary}>
                    ShellX Editor
                  </BodyText>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={() => {
                    setIsMenuVisible(false);
                    setIsHistoryModalVisible(true);
                  }}
                >
                  <MaterialIcon name="history" size={20} color={Theme.colors.text.primary} style={styles.menuItemIcon} />
                  <BodyText size={Theme.fontSize.bodyMD} color={Theme.colors.text.primary}>
                    Command History
                  </BodyText>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.menuItem, styles.cancelItem]} 
                  onPress={() => setIsMenuVisible(false)}
                >
                  <BodyText size={Theme.fontSize.bodyMD} color={Theme.colors.semantic.error} weight="semiBold">
                    Cancel
                  </BodyText>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Command History Modal */}
          <Modal
            visible={isHistoryModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsHistoryModalVisible(false)}
          >
            <SafeAreaView style={styles.historyModalContainer}>
              <View style={styles.historyHeader}>
                <BodyText size={Theme.fontSize.titleMD} color={Theme.colors.text.primary} weight="bold">
                  Command History
                </BodyText>
              </View>

              <FlatList
                data={commandHistory}
                keyExtractor={(item, index) => `history-${index}-${item}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.historyRow}
                    onPress={() => {
                      setInputText(item);
                      setHistoryIndex(-1);
                      setIsHistoryModalVisible(false);
                    }}
                  >
                    <MonoText size={Theme.fontSize.codeBase} color={Theme.colors.syntax.green} style={styles.historyRowPrompt}>
                      $
                    </MonoText>
                    <MonoText size={Theme.fontSize.codeBase} color={Theme.colors.text.primary} style={styles.historyRowText}>
                      {item}
                    </MonoText>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={styles.historyEmptyContainer}>
                    <BodyText size={Theme.fontSize.bodyMD} color={Theme.colors.text.secondary}>
                      No command history yet.
                    </BodyText>
                  </View>
                }
                contentContainerStyle={styles.historyListContent}
              />

              <View style={styles.historyFooter}>
                <TouchableOpacity
                  style={[styles.historyFooterBtn, styles.historyClearBtn]}
                  onPress={handleClearHistory}
                  disabled={commandHistory.length === 0}
                >
                  <BodyText
                    size={Theme.fontSize.labelMD}
                    color={commandHistory.length === 0 ? Theme.colors.text.tertiary : Theme.colors.semantic.error}
                    weight="semiBold"
                  >
                    CLEAR HISTORY
                  </BodyText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.historyFooterBtn, styles.historyCloseBtn]}
                  onPress={() => setIsHistoryModalVisible(false)}
                >
                  <BodyText size={Theme.fontSize.labelMD} color={Theme.colors.text.primary} weight="semiBold">
                    CLOSE
                  </BodyText>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Modal>

          {/* Remote File Editor Modal */}
          <TerminalFileEditor
            visible={isFileEditorVisible}
            onClose={() => setIsFileEditorVisible(false)}
            initialFilePath={editingFilePath}
          />

        </KeyboardAvoidingView>
      </SafeAreaView>

      {connectionState === 'connecting' && (
        <View style={[StyleSheet.absoluteFill, styles.spinnerOverlay]}>
          <TrueDarkCanvas />
          <DottedGridOverlay />
          <ScanlineOverlay />
          <View style={styles.fullscreenSpinnerContainer}>
            <ShellXSpinner label="Connecting" />
          </View>
        </View>
      )}
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
  menuOverlay: {
    flex: 1,
    backgroundColor: Theme.colors.overlay.scrim,
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: Theme.colors.background.elevated,
    borderTopLeftRadius: Theme.borderRadius.xl,
    borderTopRightRadius: Theme.borderRadius.xl,
    borderWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
    borderBottomWidth: 0,
    paddingBottom: Platform.OS === 'ios' ? Theme.spacing.xl : Theme.spacing.lg,
  },
  menuHeader: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: Theme.spacing.lg,
    borderBottomWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
  },
  menuItemIcon: {
    marginRight: Theme.spacing.md,
  },
  cancelItem: {
    justifyContent: 'center',
    borderBottomWidth: 0,
    marginTop: Theme.spacing.sm,
  },
  historyModalContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background.floor,
    borderTopWidth: Theme.borderWidth.hairline,
    borderTopColor: Theme.colors.border.subtle,
  },
  historyHeader: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: Theme.borderWidth.hairline,
    borderBottomColor: Theme.colors.border.subtle,
  },
  historyListContent: {
    paddingVertical: Theme.spacing.sm,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Theme.layout.minTouchTarget,
    paddingHorizontal: Theme.spacing.md,
    borderBottomWidth: Theme.borderWidth.hairline,
    borderBottomColor: Theme.colors.border.subtle,
  },
  historyRowPrompt: {
    marginRight: Theme.spacing.sm,
  },
  historyRowText: {
    flex: 1,
  },
  historyEmptyContainer: {
    flex: 1,
    paddingVertical: Theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyFooter: {
    flexDirection: 'row',
    borderTopWidth: Theme.borderWidth.hairline,
    borderTopColor: Theme.colors.border.subtle,
    height: Theme.layout.minTouchTarget + Theme.spacing.md,
  },
  historyFooterBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyClearBtn: {
    borderRightWidth: Theme.borderWidth.hairline,
    borderRightColor: Theme.colors.border.subtle,
  },
  historyCloseBtn: {},
  spinnerOverlay: {
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenSpinnerContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});