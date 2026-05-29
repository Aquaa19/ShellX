import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { MonoText, TerminalText } from '../../atoms';

export interface TerminalCodeLineProps {
  text: string;
  type?: 'command' | 'output' | 'error';
  lineNumber?: number;
  style?: StyleProp<ViewStyle>;
}

export const TerminalCodeLine: React.FC<TerminalCodeLineProps> = ({
  text,
  type = 'output',
  lineNumber,
  style,
}) => {
  const getTextColor = () => {
    switch (type) {
      case 'command': return Theme.colors.syntax.white;
      case 'error': return Theme.colors.semantic.error;
      case 'output':
      default: return Theme.colors.text.code;
    }
  };

  return (
    <View style={[styles.container, style]}>
      {lineNumber !== undefined && (
        <View style={styles.lineNumberContainer}>
          <MonoText size={Theme.fontSize.codeBase} color={Theme.colors.text.tertiary}>
            {lineNumber.toString().padStart(3, ' ')}
          </MonoText>
        </View>
      )}
      
      {type === 'command' && (
        <MonoText size={Theme.fontSize.codeBase} color={Theme.colors.syntax.green} style={styles.prefix}>
          $
        </MonoText>
      )}
      
      <TerminalText color={getTextColor()} style={styles.textContent}>
        {text}
      </TerminalText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: Theme.lineHeight.terminal,
  },
  lineNumberContainer: {
    width: 32,
    marginRight: Theme.spacing.sm,
    alignItems: 'flex-end',
  },
  prefix: {
    marginRight: Theme.spacing.xs,
  },
  textContent: {
    flex: 1,
    flexWrap: 'wrap',
  },
});