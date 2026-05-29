import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';

export interface FileTreeRowProps {
  depth: number;
  onPress?: () => void;
  active?: boolean;
  children: React.ReactNode;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
}

export const FileTreeRow: React.FC<FileTreeRowProps> = ({
  depth,
  onPress,
  active = false,
  children,
  accessibilityLabel,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.container,
        { paddingLeft: depth * Theme.spacing.md + Theme.spacing.sm },
        active && styles.activeContainer,
        style,
      ]}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: Theme.layout.minTouchTarget, // 44dp
    paddingRight: Theme.spacing.md,
    ...Theme.noShadow,
  },
  activeContainer: {
    backgroundColor: Theme.colors.primary.muted,
  },
});