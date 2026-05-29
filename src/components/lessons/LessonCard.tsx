import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { BorderedSurface } from '../../atoms';
import { LessonCardHeader } from './LessonCardHeader';
import { LessonProgressMeta } from './LessonProgressMeta';
import { LessonProgressBar } from './LessonProgressBar';
import type { LessonState } from './LessonStatusIcon';

export interface LessonCardProps {
  title: string;
  state: LessonState;
  progress: number; // 0 to 1
  commandsCount: number;
  estimatedMinutes: number;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  title,
  state,
  progress,
  commandsCount,
  estimatedMinutes,
  onPress,
  style,
}) => {
  const getBorderColor = () => {
    switch (state) {
      case 'inProgress': return Theme.colors.primary.default;
      case 'complete': return Theme.colors.semantic.success;
      case 'locked':
      default: return Theme.colors.border.subtle;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={state === 'locked'}
      accessibilityRole="button"
      accessibilityLabel={`Lesson: ${title}, Status: ${state}`}
      style={style}
    >
      <BorderedSurface
        level="default"
        borderColor={getBorderColor()}
        style={[
          styles.container,
          state === 'locked' && styles.lockedContainer
        ]}
      >
        <LessonCardHeader title={title} state={state} />
        <LessonProgressMeta commandsCount={commandsCount} estimatedMinutes={estimatedMinutes} />
        <LessonProgressBar progress={progress} state={state} style={styles.progressBar} />
      </BorderedSurface>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Theme.spacing.md,
    minHeight: Theme.layout.lessonCardMinHeight, // 100
  },
  lockedContainer: {
    opacity: 0.6,
  },
  progressBar: {
    marginTop: Theme.spacing.md,
  },
});