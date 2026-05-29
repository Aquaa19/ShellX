import React from 'react';
import { TextStyle, StyleProp } from 'react-native';
import { Theme } from '../../tokens';
import { MonoText } from './MonoText';

export type SyntaxRole = 'keyword' | 'string' | 'variable' | 'comment' | 'error' | 'builtin' | 'default';

export interface SyntaxTextProps {
  children: React.ReactNode;
  role: SyntaxRole;
  style?: StyleProp<TextStyle>;
}

export const SyntaxText: React.FC<SyntaxTextProps> = ({
  children,
  role,
  style,
}) => {
  const getSyntaxColor = (): string => {
    switch (role) {
      case 'keyword': return Theme.colors.syntax.blue;
      case 'string': return Theme.colors.syntax.green;
      case 'variable': return Theme.colors.syntax.orange;
      case 'comment': return Theme.colors.syntax.gray;
      case 'error': return Theme.colors.syntax.red;
      case 'builtin': return Theme.colors.syntax.purple;
      case 'default':
      default: return Theme.colors.syntax.white;
    }
  };

  return (
    <MonoText
      color={getSyntaxColor()}
      style={style}
    >
      {children}
    </MonoText>
  );
};