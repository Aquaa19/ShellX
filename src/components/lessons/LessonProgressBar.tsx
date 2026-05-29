import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { ProgressTrack } from '../../atoms';
import type { LessonState } from './LessonStatusIcon';

export interface LessonProgressBarProps {
  progress: number;
  state: LessonState;
  style?: StyleProp<ViewStyle>;
}

export const LessonProgressBar: React.FC<LessonProgressBarProps> = ({
  progress,
  state,
  style,
}) => {
  const getProgressColor = () => {
    switch (state) {
      case 'complete': return Theme.colors.semantic.success;
      case 'inProgress': return Theme.colors.primary.default;
      case 'locked':
      default: return Theme.colors.border.subtle;
    }
  };

  return (
    <ProgressTrack 
      progress={state === 'locked' ? 0 : progress} 
      color={getProgressColor()} 
      style={style} 
    />
  );
};