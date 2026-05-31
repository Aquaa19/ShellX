import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Modal, TouchableOpacity } from 'react-native';
import { Theme } from '../tokens';
import { IconButton, MaterialIcon, ConnectionBadge } from '../atoms';
import { BodyText } from '../atoms/text/BodyText';
import { 
  AppBackground, 
  AppHeader, 
  ShellXLogoText, 
  TerminalWorkspace,
  TerminalFileEditor
} from '../components';
import { useAppContext, useAuthContext, useTerminalConnection } from '../context';
import type { VimMode } from '../types';

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
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isFileEditorVisible, setIsFileEditorVisible] = useState(false);
  const [editingFilePath, setEditingFilePath] = useState('/home/student/project/a.txt');
  const [isCtrlActive, setIsCtrlActive] = useState(false);
  const [isAltActive, setIsAltActive] = useState(false);

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
            filepath="/home/student/project/script.sh"
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
                    Remote File Editor
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

          {/* Remote File Editor Modal */}
          <TerminalFileEditor
            visible={isFileEditorVisible}
            onClose={() => setIsFileEditorVisible(false)}
            initialFilePath={editingFilePath}
          />

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
});