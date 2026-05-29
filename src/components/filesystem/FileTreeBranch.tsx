import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { FolderRow } from './FolderRow';
import { TreeIndentGuide } from './TreeIndentGuide';

export interface FileTreeBranchProps {
  folderName: string;
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const FileTreeBranch: React.FC<FileTreeBranchProps> = ({
  folderName,
  depth,
  isOpen,
  onToggle,
  children,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <FolderRow
        name={folderName}
        depth={depth}
        isOpen={isOpen}
        onPress={onToggle}
      />
      {isOpen && children && (
        <View style={styles.childrenWrapper}>
          <TreeIndentGuide depth={depth} />
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  childrenWrapper: {
    position: 'relative',
    flexDirection: 'column',
  },
});