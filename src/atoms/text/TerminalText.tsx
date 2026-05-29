import React from 'react';
import { TextStyle, StyleProp } from 'react-native';
import { Theme } from '../../tokens';
import { MonoText } from './MonoText';

export interface TerminalTextProps {
  children: React.ReactNode;
  color?: string;
  dimmed?: boolean;
  style?: StyleProp<TextStyle>;
}

export const TerminalText: React.FC<TerminalTextProps> = ({
  children,
  color,
  dimmed = false,
  style,
}) => {
  const resolvedColor = dimmed 
    ? Theme.colors.text.secondary 
    : (color || Theme.colors.text.code);

  return (
    <MonoText
      color={resolvedColor}
      selectable={true}
      style={style}
    >
      {children}
    </MonoText>
  );
};