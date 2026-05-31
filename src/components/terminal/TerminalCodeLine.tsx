import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { MonoText, TerminalText } from '../../atoms';
import type { TerminalLine } from '../../types';

export interface TerminalCodeLineProps {
  line: TerminalLine;
  style?: StyleProp<ViewStyle>;
}

export const TerminalCodeLine: React.FC<TerminalCodeLineProps> = React.memo(({
  line,
  style,
}) => {
  const { type = 'output', content } = line;

  const getTextColor = () => {
    switch (type) {
      case 'command': return Theme.colors.syntax.white;
      case 'error': return Theme.colors.semantic.error;
      case 'output':
      default: return Theme.colors.text.code;
    }
  };

  const renderCommandContent = () => {
    // Match e.g., "student@4d95575ccd6a:~$ who" -> prompt ("student@4d95575ccd6a:~$") and command (" who")
    const promptMatch = content.match(/^([^$#]*[$#])(.*)$/);
    if (promptMatch) {
      const [, prompt, cmd] = promptMatch;
      return (
        <TerminalText style={styles.textContent}>
          <MonoText size={Theme.fontSize.codeBase} color={Theme.colors.syntax.green}>
            {prompt}
          </MonoText>
          <MonoText size={Theme.fontSize.codeBase} color={Theme.colors.syntax.white}>
            {cmd}
          </MonoText>
        </TerminalText>
      );
    }

    return (
      <TerminalText color={Theme.colors.syntax.white} style={styles.textContent}>
        {content}
      </TerminalText>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {type === 'command' ? (
        renderCommandContent()
      ) : (
        <TerminalText color={getTextColor()} style={styles.textContent}>
          {content}
        </TerminalText>
      )}
    </View>
  );
}, (prev, next) => prev.line.id === next.line.id);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: Theme.lineHeight.terminal,
  },
  prefix: {
    marginRight: Theme.spacing.xs,
  },
  textContent: {
    flex: 1,
    flexWrap: 'wrap',
  },
});