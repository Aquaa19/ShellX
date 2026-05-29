import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { TerminalText, SyntaxText, SyntaxRole } from '../../atoms';

export interface OutputLine {
  text: string;
  role?: SyntaxRole;
}

export interface AuthTerminalOutputProps {
  lines: OutputLine[];
  style?: StyleProp<ViewStyle>;
}

export const AuthTerminalOutput: React.FC<AuthTerminalOutputProps> = ({
  lines,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {lines.map((line, index) => {
        const isOlderLine = index !== lines.length - 1;

        if (line.role) {
          return (
            <SyntaxText 
              key={index} 
              role={line.role} 
              style={isOlderLine ? styles.dimmedSyntaxText : undefined}
            >
              {line.text}
            </SyntaxText>
          );
        }

        return (
          <TerminalText 
            key={index} 
            dimmed={isOlderLine}
          >
            {line.text}
          </TerminalText>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: Theme.spacing.sm,
    backgroundColor: Theme.colors.background.floor,
    borderRadius: Theme.borderRadius.default,
    marginTop: Theme.spacing.xl,
    borderWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
    ...Theme.noShadow,
  },
  dimmedSyntaxText: {
    opacity: 0.7, // Manually dim SyntaxText elements so they fade similarly to TerminalText
  },
});