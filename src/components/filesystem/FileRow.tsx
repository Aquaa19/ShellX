import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { MonoText, FileTypeIcon } from '../../atoms';
import { FileTreeRow } from './FileTreeRow';

export interface FileRowProps {
  name: string;
  extension: string;
  depth: number;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const FileRow: React.FC<FileRowProps> = ({
  name,
  extension,
  depth,
  onPress,
  style,
}) => {
  return (
    <FileTreeRow
      depth={depth}
      onPress={onPress}
      accessibilityLabel={`File: ${name}`}
      style={style}
    >
      <View style={styles.iconWrapper} accessible={false} importantForAccessibility="no-hide-descendants">
        <FileTypeIcon extension={extension} size="md" />
      </View>
      <MonoText size={Theme.fontSize.bodySM} color={Theme.colors.text.secondary}>
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