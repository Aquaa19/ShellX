import React from 'react';
import { ScrollView, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { FileTreeNode } from '../../types';
import { FileTreeBranch } from './FileTreeBranch';
import { SelectedFileRow } from './SelectedFileRow';
import { FileRow } from './FileRow';

export interface FileSystemTreeProps {
  tree: FileTreeNode[];
  selectedPath: string | null;
  pendingPaths?: Set<string>;
  onFileSelect: (node: FileTreeNode) => void;
  onFolderToggle: (node: FileTreeNode) => void;
  style?: StyleProp<ViewStyle>;
}

export const FileSystemTree: React.FC<FileSystemTreeProps> = ({
  tree,
  selectedPath,
  pendingPaths = new Set(),
  onFileSelect,
  onFolderToggle,
  style,
}) => {
  const renderTreeNodes = (nodes: FileTreeNode[], depth: number = 0) => {
    return nodes.map((node) => {
      const isExpanded = !!node.isExpanded;
      const isSelected = selectedPath === node.path;

      if (node.type === 'directory') {
        const isLoading = pendingPaths.has(node.path) || !!node.isLoading;
        return (
          <FileTreeBranch
            key={node.path}
            folderName={node.name}
            depth={depth}
            isOpen={isExpanded}
            isLoading={isLoading}
            onToggle={() => onFolderToggle(node)}
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
            extension={node.extension || ''}
            depth={depth}
          />
        );
      }

      return (
        <FileRow
          key={node.path}
          name={node.name}
          extension={node.extension || ''}
          depth={depth}
          onPress={() => onFileSelect(node)}
        />
      );
    });
  };

  return (
    <ScrollView
      style={[styles.verticalScroll, style]}
      contentContainerStyle={styles.verticalContent}
      showsVerticalScrollIndicator={true}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.horizontalContent}
      >
        <View style={styles.treeContainer}>
          {renderTreeNodes(tree)}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  verticalScroll: {
    flex: 1,
    backgroundColor: Theme.colors.background.floor,
    ...Theme.noShadow,
  },
  verticalContent: {
    flexGrow: 1,
    paddingVertical: Theme.spacing.sm,
  },
  horizontalContent: {
    flexGrow: 1,
    minWidth: '100%',
    paddingRight: Theme.spacing.xl,
  },
  treeContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});