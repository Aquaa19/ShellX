import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { SectionHeader } from '../../atoms';

export interface LessonModuleSectionProps {
  moduleTitle: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const LessonModuleSection: React.FC<LessonModuleSectionProps> = ({
  moduleTitle,
  children,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <SectionHeader title={moduleTitle} style={styles.header} />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.lg,
  },
  header: {
    marginBottom: Theme.spacing.sm,
    borderBottomWidth: 0, // Override default SectionHeader border for grid layouts
  },
  content: {
    paddingHorizontal: Theme.spacing.sm, // Adjusting alignment for grid
  },
});