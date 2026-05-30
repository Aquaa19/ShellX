import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Theme } from '../tokens';
import { MonoText, SecondaryActionButton } from '../atoms';
import { 
  AppBackground, 
  FocusedHeader,
  FileSystemTree,
  FileTreeBranch,
  FileRow,
  SelectedFileRow
} from '../components';
import { MOCK_FILE_TREE, FileTreeNode } from '../data';

export const FileSystemScreen: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<string>('/home/student');
  const [expandedPaths, setExpandedPaths] = useState<string[]>(['/home/student', '/home/student/projects']);

  const togglePath = (path: string) => {
    setExpandedPaths(prev => 
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  const renderTreeNodes = (nodes: FileTreeNode[], depth: number = 0) => {
    return nodes.map((node) => {
      const isExpanded = expandedPaths.includes(node.path);
      const isSelected = selectedPath === node.path;

      if (node.type === 'directory') {
        return (
          <FileTreeBranch
            key={node.path}
            folderName={node.name}
            depth={depth}
            isOpen={isExpanded}
            onToggle={() => {
              setSelectedPath(node.path);
              togglePath(node.path);
            }}
          >
            {isExpanded && node.children && renderTreeNodes(node.children, depth + 1)}
          </FileTreeBranch>
        );
      }

      if (isSelected) {
        return (
          <SelectedFileRow
            key={node.path}
            name={node.name}
            extension={node.extension}
            depth={depth}
          />
        );
      }

      return (
        <FileRow
          key={node.path}
          name={node.name}
          extension={node.extension}
          depth={depth}
          onPress={() => setSelectedPath(node.path)}
        />
      );
    });
  };

  return (
    <AppBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <FocusedHeader title="File System" onBackPress={() => {}} />
          
          <View style={styles.breadcrumbStrip}>
            <MonoText size={Theme.fontSize.labelSM} color={Theme.colors.text.secondary}>
              {selectedPath}
            </MonoText>
          </View>

          <FileSystemTree style={styles.treeWorkspace}>
            {renderTreeNodes(MOCK_FILE_TREE)}
          </FileSystemTree>

          <View style={styles.actionBar}>
            <SecondaryActionButton label="OPEN" onPress={() => {}} style={styles.actionBtn} />
            <View style={styles.actionGap} />
            <SecondaryActionButton label="COPY PATH" onPress={() => {}} style={styles.actionBtn} />
          </View>
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