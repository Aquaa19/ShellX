import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { Theme } from '../../tokens';
import { MaterialIcon } from '../../atoms';

export type LessonState = 'complete' | 'inProgress' | 'locked';

export interface LessonStatusIconProps {
  state: LessonState;
  size?: number;
  style?: StyleProp<TextStyle>;
}

export const LessonStatusIcon: React.FC<LessonStatusIconProps> = ({
  state,
  size = 24,
  style,
}) => {
  const getIconProps = () => {
    switch (state) {
      case 'complete': return { name: 'check-circle', color: Theme.colors.semantic.success };
      case 'inProgress': return { name: 'radio-button-checked', color: Theme.colors.primary.default };
      case 'locked':
      default: return { name: 'lock', color: Theme.colors.text.tertiary };
    }
  };

  const { name, color } = getIconProps();

  return (
    <MaterialIcon name={name} size={size} color={color} style={style} />
  );
};