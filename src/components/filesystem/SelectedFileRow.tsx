import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { MonoText, FileTypeIcon } from '../../atoms';
import { FileTreeRow } from './FileTreeRow';

export interface SelectedFileRowProps {
  name: string;
  extension: string;
  depth: number;
  style?: StyleProp<ViewStyle>;
}

export const SelectedFileRow: React.FC<SelectedFileRowProps> = ({
  name,
  extension,
  depth,
  style,
}) => {
  return (
    <FileTreeRow
      depth={depth}
      active={true}
      accessibilityLabel={`Selected File: ${name}`}
      style={style}
    >
      <View style={styles.iconWrapper} accessible={false} importantForAccessibility="no-hide-descendants">
        <FileTypeIcon extension={extension} size="md" color={Theme.colors.primary.default} />
      </View>
      <MonoText size={Theme.fontSize.bodySM} color={Theme.colors.text.primary} weight="bold">
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