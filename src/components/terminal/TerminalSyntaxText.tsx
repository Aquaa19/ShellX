import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { Theme } from '../../tokens';
import { SyntaxText } from '../../atoms';
import type { SyntaxRole } from '../../atoms'; // Assuming exported from atoms

export interface SyntaxToken {
  text: string;
  role: SyntaxRole;
}

export interface TerminalSyntaxTextProps {
  tokens: SyntaxToken[];
  style?: StyleProp<TextStyle>;
}

export const TerminalSyntaxText: React.FC<TerminalSyntaxTextProps> = ({
  tokens,
  style,
}) => {
  return (
    <Text style={[styles.container, style]}>
      {tokens.map((token, index) => (
        <SyntaxText key={index} role={token.role}>
          {token.text}
        </SyntaxText>
      ))}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    fontFamily: Theme.fontFamily.mono,
    fontSize: Theme.fontSize.codeBase,
    lineHeight: Theme.lineHeight.terminal,
  },
});