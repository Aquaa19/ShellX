import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Clipboard, Animated, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../tokens';
import { MonoText, SecondaryActionButton, IconButton, MaterialIcon, StatusIndicatorBadge, BodyText } from '../atoms';
import { 
  AppBackground, 
  AppHeader,
  FileSystemTree,
  ShellXLogoText,
  TerminalFileEditor
} from '../components';
import { useFileSystemContext, useTerminalConnection } from '../context';

const SkeletonRow: React.FC<{ opacity: Animated.Value; depth: number }> = ({ opacity, depth }) => {
  return (
    <Animated.View
      style={[
        styles.skeletonRow,
        {
          opacity,
          paddingLeft: depth * Theme.spacing.md + Theme.spacing.sm,
        },
      ]}
    >
      <View style={styles.skeletonChevron} />
      <View style={styles.skeletonIcon} />
      <View style={styles.skeletonText} />
    </Animated.View>
  );
};

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
  const opacityAnim = useRef(new Animated.Value(0.7)).current;

  const getDirectoryPath = (path: string): string => {
    const lastSlashIdx = path.lastIndexOf('/');
    if (lastSlashIdx === -1) return path;
    if (lastSlashIdx === 0) return '/';
    return path.substring(0, lastSlashIdx);
  };

  // Initial fetch on mount or socket reconnects
  useEffect(() => {
    if (connectionState === 'connected') {
      initialize();
    }
  }, [connectionState, initialize]);

  // Skeleton loading pulse anims
  useEffect(() => {
    let anim: Animated.CompositeAnimation | null = null;
    if (isRootLoading) {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.3,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      );
      anim.start();
    } else {
      opacityAnim.setValue(1.0);
    }
    return () => {
      if (anim) anim.stop();
    };
  }, [isRootLoading, opacityAnim]);

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
          text: "Code Editor",
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
                icon={<MaterialIcon name="settings" size={24} color={Theme.colors.text.secondary} />}
                onPress={() => navigation.navigate('Settings')}
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
            <View style={styles.skeletonContainer}>
              <SkeletonRow opacity={opacityAnim} depth={0} />
              <SkeletonRow opacity={opacityAnim} depth={1} />
              <SkeletonRow opacity={opacityAnim} depth={1} />
              <SkeletonRow opacity={opacityAnim} depth={2} />
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
  skeletonContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background.floor,
    paddingVertical: Theme.spacing.sm,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Theme.layout.minTouchTarget,
    paddingRight: Theme.spacing.md,
  },
  skeletonChevron: {
    width: 20,
    height: 20,
    borderRadius: Theme.borderRadius.default,
    backgroundColor: Theme.colors.border.subtle,
    marginRight: Theme.spacing.xs,
  },
  skeletonIcon: {
    width: 20,
    height: 20,
    borderRadius: Theme.borderRadius.default,
    backgroundColor: Theme.colors.border.subtle,
    marginRight: Theme.spacing.sm,
  },
  skeletonText: {
    flex: 1,
    height: 14,
    borderRadius: Theme.borderRadius.default,
    backgroundColor: Theme.colors.border.subtle,
    maxWidth: 150,
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