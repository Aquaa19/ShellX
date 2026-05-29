import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { Theme } from '../../tokens';
import { MaterialIcon, IconSize } from './MaterialIcon';

export interface TerminalIconProps {
  size?: IconSize | number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const TerminalIcon: React.FC<TerminalIconProps> = ({
  size = 'md',
  color = Theme.colors.primary.default,
  style,
}) => {
  return (
    <MaterialIcon
      name="terminal"
      size={size}
      color={color}
      style={style}
    />
  );
};