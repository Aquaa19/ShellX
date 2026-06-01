import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  SafeAreaView, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ToastAndroid
} from 'react-native';
import { Theme } from '../../tokens';
import { useTerminalConnection } from '../../context';
import { IconButton, MaterialIcon, PrimaryActionButton, SecondaryActionButton } from '../../atoms';
import { BodyText } from '../../atoms/text/BodyText';
import { ShellXSpinner } from '../shell';

interface TerminalFileEditorProps {
  visible: boolean;
  onClose: () => void;
  initialFilePath?: string;
}

export const TerminalFileEditor: React.FC<TerminalFileEditorProps> = ({ 
  visible, 
  onClose,
  initialFilePath,
}) => {
  const { executeBackgroundCommand, connectionState } = useTerminalConnection();
  const [filePath, setFilePath] = useState('/home/student/project/a.txt');
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const loadFileContent = useCallback(async (targetPath: string) => {
    if (!targetPath.trim()) {
      setStatusMessage({ text: 'Please enter a valid file path.', isError: true });
      return;
    }

    if (connectionState !== 'connected') {
      setStatusMessage({ text: 'Terminal is offline. Connect to server first.', isError: true });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      // Execute silent background read command
      const response = await executeBackgroundCommand(`cat "${targetPath.trim()}" 2>&1`);
      
      // Check if command printed a shell error
      if (
        response.includes('No such file or directory') || 
        response.includes('Permission denied') ||
        response.includes('Is a directory')
      ) {
        setStatusMessage({ text: response, isError: true });
        setContent('');
        setOriginalContent('');
      } else {
        setContent(response);
        setOriginalContent(response);
        setStatusMessage({ text: 'File loaded successfully.', isError: false });
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Failed to load file.', isError: true });
    } finally {
      setIsLoading(false);
    }
  }, [connectionState, executeBackgroundCommand]);

  // Sync and load initial file when editor opens
  useEffect(() => {
    if (visible) {
      setStatusMessage(null);
      const path = initialFilePath || '/home/student/project/a.txt';
      setFilePath(path);
      if (initialFilePath && connectionState === 'connected') {
        loadFileContent(path);
      } else {
        setContent('');
        setOriginalContent('');
      }
    }
  }, [visible, initialFilePath, connectionState, loadFileContent]);

  const handleLoadFile = () => {
    loadFileContent(filePath);
  };

  const saveFileDirectly = async (): Promise<boolean> => {
    if (!filePath.trim()) {
      setStatusMessage({ text: 'Please enter a valid file path.', isError: true });
      return false;
    }

    if (connectionState !== 'connected') {
      setStatusMessage({ text: 'Terminal is offline. Connect to server first.', isError: true });
      return false;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      // Build clean multi-line heredoc command
      // We single-quote SH_EOF to prevent variable expansions in the file body.
      const saveCommand = `cat << 'SH_EOF' > "${filePath.trim()}"\n${content}\nSH_EOF`;
      
      await executeBackgroundCommand(saveCommand);
      setOriginalContent(content);
      
      const msg = `Saved: ${filePath.trim()}`;
      if (Platform.OS === 'android') {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
      } else {
        Alert.alert('File Saved', msg);
      }
      
      setStatusMessage({ text: 'File saved successfully.', isError: false });
      return true;
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Failed to save file.', isError: true });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveFile = () => {
    saveFileDirectly();
  };

  const handleClose = () => {
    const hasChanges = content !== originalContent;
    if (hasChanges) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Leaving will cause data loss.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Discard",
            style: "destructive",
            onPress: onClose
          },
          {
            text: "Save & Exit",
            onPress: async () => {
              const success = await saveFileDirectly();
              if (success) {
                onClose();
              }
            }
          }
        ]
      );
    } else {
      onClose();
    }
  };

  const hasChanges = content !== originalContent;
  const isSaveDisabled = isLoading || !hasChanges || connectionState !== 'connected';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          style={styles.container} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Header Row */}
          <View style={styles.header}>
            <IconButton 
              icon={<MaterialIcon name="arrow-back" size={24} color={Theme.colors.text.primary} />}
              onPress={handleClose}
              style={styles.closeButton}
            />
            <BodyText weight="bold" size={Theme.fontSize.titleLG} style={styles.headerTitle}>
              ShellX Editor
            </BodyText>
            <View style={styles.saveButtonContainer}>
              <PrimaryActionButton
                label="SAVE"
                onPress={handleSaveFile}
                disabled={isSaveDisabled}
                style={styles.saveButton}
              />
            </View>
          </View>

          {/* Connection warning bar if not connected */}
          {connectionState !== 'connected' && (
            <View style={styles.warningBar}>
              <BodyText size={Theme.fontSize.labelMD} style={styles.warningText}>
                ⚠️ Connection Offline — Reconnecting...
              </BodyText>
            </View>
          )}

          {/* Path Bar Row */}
          <View style={styles.pathBar}>
            <TextInput
              style={styles.pathInput}
              value={filePath}
              onChangeText={setFilePath}
              placeholder="e.g. /home/student/project/a.txt"
              placeholderTextColor={Theme.colors.text.placeholder}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            <SecondaryActionButton
              label="LOAD"
              onPress={handleLoadFile}
              disabled={isLoading || connectionState !== 'connected'}
              style={styles.loadButton}
            />
          </View>

          {/* Dynamic Status Banner */}
          {statusMessage && (
            <View style={[
              styles.statusBanner, 
              statusMessage.isError ? styles.statusError : styles.statusSuccess
            ]}>
              <BodyText size={Theme.fontSize.bodySM} style={styles.statusText}>
                {statusMessage.text}
              </BodyText>
            </View>
          )}

          {/* Core Code Editor Workspace */}
          <View style={styles.editorWrapper}>
            <TextInput
              style={styles.editorInput}
              value={content}
              onChangeText={setContent}
              placeholder="Start editing remote file..."
              placeholderTextColor={Theme.colors.text.placeholder}
              multiline={true}
              scrollEnabled={true}
              autoCapitalize="none"
              autoCorrect={false}
              textAlignVertical="top"
              editable={!isLoading}
            />
            
            {isLoading && (
              <View style={styles.spinnerContainer}>
                <ShellXSpinner label="Loading File" size="small" />
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background.floor,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderBottomWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
    backgroundColor: Theme.colors.background.floor,
    paddingHorizontal: Theme.spacing.sm,
  },
  closeButton: {
    width: Theme.layout.minTouchTarget,
    height: Theme.layout.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: Theme.colors.text.primary,
  },
  saveButtonContainer: {
    width: 80,
    alignItems: 'flex-end',
  },
  saveButton: {
    minHeight: 36,
    height: 36,
    paddingHorizontal: Theme.spacing.md,
  },
  warningBar: {
    backgroundColor: Theme.colors.semantic.warningDim,
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.md,
    alignItems: 'center',
  },
  warningText: {
    color: Theme.colors.semantic.warning,
  },
  pathBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    borderBottomWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
  },
  pathInput: {
    flex: 1,
    height: Theme.layout.minTouchTarget,
    borderWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
    borderRadius: Theme.borderRadius.default,
    backgroundColor: Theme.colors.background.input,
    color: Theme.colors.text.primary,
    fontFamily: Theme.fontFamily.mono,
    fontSize: Theme.fontSize.bodySM,
    paddingHorizontal: Theme.spacing.md,
    marginRight: Theme.spacing.md,
  },
  loadButton: {
    minHeight: Theme.layout.minTouchTarget,
    height: Theme.layout.minTouchTarget,
    paddingHorizontal: Theme.spacing.lg,
  },
  statusBanner: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
  },
  statusError: {
    backgroundColor: Theme.colors.semantic.errorDim,
  },
  statusSuccess: {
    backgroundColor: Theme.colors.semantic.successDim,
  },
  statusText: {
    color: Theme.colors.text.primary,
  },
  editorWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: Theme.colors.background.floor,
  },
  editorInput: {
    flex: 1,
    fontFamily: Theme.fontFamily.mono,
    fontSize: Theme.fontSize.codeBase,
    color: Theme.colors.syntax.white,
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.background.floor,
  },
  spinnerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Theme.colors.overlay.scrim,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
