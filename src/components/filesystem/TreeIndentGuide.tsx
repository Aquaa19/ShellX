import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';

export interface TreeIndentGuideProps {
  depth: number;
  style?: StyleProp<ViewStyle>;
}

export const TreeIndentGuide: React.FC<TreeIndentGuideProps> = ({
  depth,
  style,
}) => {
  // Calculates exact positioning matching the text indentation from FileTreeRow
  const indentOffset = (depth * Theme.spacing.md) + Theme.spacing.sm + (18 / 2); // 18 is the icon size 'md'

  return (
    <View
      style={[
        styles.guide,
        { left: indentOffset },
        style,
      ]}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    />
  );
};

const styles = StyleSheet.create({
  guide: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: Theme.colors.border.subtle,
    zIndex: Theme.zIndex.floor,
    ...Theme.noShadow,
  },
});