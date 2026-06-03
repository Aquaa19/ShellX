import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { HeadlineText, BodyText, SecondaryActionButton } from '../../atoms';
import { AsciiProgressText } from './AsciiProgressText';

export interface LessonsHeaderProps {
  title: string;
  subtitle: string;
  overallProgress: number; // 0 to 1
  style?: StyleProp<ViewStyle>;
  showStartButton?: boolean;
  onStartPress?: () => void;
}

export const LessonsHeader: React.FC<LessonsHeaderProps> = ({
  title,
  subtitle,
  overallProgress,
  style,
  showStartButton,
  onStartPress,
}) => {
  return (
    <View style={[styles.container, style]}>
      <HeadlineText size={Theme.fontSize.headlineMD} weight="bold" color={Theme.colors.text.primary} style={styles.title}>
        {title}
      </HeadlineText>
      <BodyText size={Theme.fontSize.bodyMD} color={Theme.colors.text.secondary} style={styles.subtitle}>
        {subtitle}
      </BodyText>
      <View style={styles.progressRow}>
        <AsciiProgressText progress={overallProgress} length={12} style={styles.progress} />
        {showStartButton && onStartPress && (
          <SecondaryActionButton
            label="Start Journey"
            onPress={onStartPress}
            style={styles.startBtn}
          />
        )}
      </View>
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
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.xs,
  },
  progress: {
    marginTop: 0,
  },
  startBtn: {
    borderColor: Theme.colors.syntax.green,
    marginLeft: Theme.spacing.md,
  },
});