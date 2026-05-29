import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { MonoText, FolderIcon } from '../../atoms';
import { FileTreeRow } from './FileTreeRow';

export interface FolderRowProps {
  name: string;
  depth: number;
  isOpen: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const FolderRow: React.FC<FolderRowProps> = ({
  name,
  depth,
  isOpen,
  onPress,
  style,
}) => {
  return (
    <FileTreeRow
      depth={depth}
      onPress={onPress}
      accessibilityLabel={`Folder: ${name}, ${isOpen ? 'Expanded' : 'Collapsed'}`}
      style={style}
    >
      <View style={styles.iconWrapper} accessible={false} importantForAccessibility="no-hide-descendants">
        <FolderIcon open={isOpen} size="md" />
      </View>
      <MonoText size={Theme.fontSize.bodySM} color={Theme.colors.text.primary}>
        {name}
      </MonoText>
    </FileTreeRow>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    marginRight: Theme.spacing.sm,
  },
});