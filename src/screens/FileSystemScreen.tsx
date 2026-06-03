import React, { useState, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, Clipboard, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Theme } from '../tokens';
import { MonoText, SecondaryActionButton, IconButton, MaterialIcon, StatusIndicatorBadge, BodyText } from '../atoms';
import { 
  AppBackground, 
  AppHeader,
  FileSystemTree,
  ShellXLogoText,
  TerminalFileEditor,
  ShellXSpinner
} from '../components';
import { useFileSystemContext, useTerminalConnection } from '../context';

export const FileSystemScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  
  const {
    tree,
    rootPath,
    selectedPath,
    selectedNode,
    isRootLoading,
    pendingPaths,
    expandFolder,
    collapseFolder,
    selectFile,
    initialize,
  } = useFileSystemContext();

  const { connectionState, sendCommand } = useTerminalConnection();
  const [isCopied, setIsCopied] = useState(false);
  const [editorFilePath, setEditorFilePath] = useState('');
  const [isEditorVisible, setIsEditorVisible] = useState(false);

  const getDirectoryPath = (path: string): string => {
    const lastSlashIdx = path.lastIndexOf('/');
    if (lastSlashIdx === -1) return path;
    if (lastSlashIdx === 0) return '/';
    return path.substring(0, lastSlashIdx);
  };

  // Fetch files whenever the screen comes into focus or connection state changes
  useFocusEffect(
    useCallback(() => {
      if (connectionState === 'connected') {
        initialize();
      }
    }, [connectionState, initialize])
  );

  const handleOpenPress = () => {
    if (!selectedNode) return;

    if (selectedNode.type === 'directory') {
      return;
    }

    Alert.alert(
      "Open File",
      "Where do you want to open this file?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Terminal",
          onPress: () => {
            const dirPath = getDirectoryPath(selectedNode.path);
            sendCommand(`cd "${dirPath}"`);
            navigation.navigate('Terminal');
          }
        },
        {
          text: "ShellX Editor",
          onPress: () => {
            setEditorFilePath(selectedNode.path);
            setIsEditorVisible(true);
          }
        }
      ],
      { cancelable: true }
    );
  };

  const handleCopyPath = () => {
    if (selectedNode) {
      Clipboard.setString(selectedNode.path);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    }
  };

  return (
    <AppBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <AppHeader
            centerSlot={
              <ShellXLogoText text="ShellX_Files" size={Theme.fontSize.titleLG} />
            }
            leftSlot={
              <IconButton
                icon={<MaterialIcon name="terminal" size={24} color={Theme.colors.primary.default} />}
                onPress={() => navigation.navigate('Terminal')}
                variant="ghost"
              />
            }
            rightSlot={
              <IconButton
                icon={<MaterialIcon name="refresh" size={24} color={Theme.colors.primary.default} />}
                onPress={initialize}
                variant="ghost"
              />
            }
          />
          
          <View style={styles.breadcrumbStrip}>
            <MonoText size={Theme.fontSize.labelSM} color={Theme.colors.text.secondary}>
              {selectedPath ?? rootPath}
            </MonoText>
          </View>

          {connectionState !== 'connected' ? (
            <View style={styles.centeredContainer}>
              <StatusIndicatorBadge variant="error" label="NOT CONNECTED" />
              <BodyText size={Theme.fontSize.bodyMD} color={Theme.colors.text.secondary} style={styles.offlineText}>
                Connect to a remote server in Settings.
              </BodyText>
            </View>
          ) : isRootLoading ? (
            <View style={styles.centeredContainer}>
              <ShellXSpinner label="Loading Files" />
            </View>
          ) : (
            <FileSystemTree
              tree={tree}
              selectedPath={selectedPath}
              pendingPaths={pendingPaths}
              onFileSelect={selectFile}
              onFolderToggle={(node) =>
                node.isExpanded ? collapseFolder(node.path) : expandFolder(node)
              }
              style={styles.treeWorkspace}
            />
          )}

          <View style={styles.actionBar}>
            <SecondaryActionButton
              label="OPEN"
              onPress={handleOpenPress}
              disabled={!selectedNode || selectedNode.type === 'directory' || connectionState !== 'connected'}
              style={styles.actionBtn}
            />
            <View style={styles.actionGap} />
            <SecondaryActionButton
              label={isCopied ? 'COPIED' : 'COPY PATH'}
              onPress={handleCopyPath}
              disabled={!selectedNode}
              style={styles.actionBtn}
            />
          </View>

          {/* Remote File Editor Modal */}
          <TerminalFileEditor
            visible={isEditorVisible}
            onClose={() => setIsEditorVisible(false)}
            initialFilePath={editorFilePath}
          />
        </View>
      </SafeAreaView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  breadcrumbStrip: {
    height: 36,
    backgroundColor: Theme.colors.surface.raised,
    paddingHorizontal: Theme.spacing.md,
    justifyContent: 'center',
    borderBottomWidth: Theme.borderWidth.hairline,
    borderBottomColor: Theme.colors.border.subtle,
  },
  treeWorkspace: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.floor,
    padding: Theme.spacing.xl,
  },
  offlineText: {
    marginTop: Theme.spacing.md,
    textAlign: 'center',
  },

  actionBar: {
    flexDirection: 'row',
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.background.elevated,
    borderTopWidth: Theme.borderWidth.hairline,
    borderTopColor: Theme.colors.border.subtle,
  },
  actionBtn: {
    flex: 1,
  },
  actionGap: {
    width: Theme.spacing.md,
  },
});