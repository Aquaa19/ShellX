import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { HeadlineText, BodyText } from '../../atoms';
import { AsciiProgressText } from './AsciiProgressText';

export interface LessonsHeaderProps {
  title: string;
  subtitle: string;
  overallProgress: number; // 0 to 1
  style?: StyleProp<ViewStyle>;
}

export const LessonsHeader: React.FC<LessonsHeaderProps> = ({
  title,
  subtitle,
  overallProgress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <HeadlineText size={Theme.fontSize.headlineMD} weight="bold" color={Theme.colors.text.primary} style={styles.title}>
        {title}
      </HeadlineText>
      <BodyText size={Theme.fontSize.bodyMD} color={Theme.colors.text.secondary} style={styles.subtitle}>
        {subtitle}
      </BodyText>
      <AsciiProgressText progress={overallProgress} length={12} style={styles.progress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.background.elevated,
    borderBottomWidth: Theme.borderWidth.hairline,
    borderBottomColor: Theme.colors.border.subtle,
    ...Theme.noShadow,
  },
  title: {
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    marginBottom: Theme.spacing.md,
  },
  progress: {
    marginTop: Theme.spacing.xs,
  },
});