import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { MonoText, TerminalTextInput } from '../../atoms';
import { TerminalCursor } from './TerminalCursor';

export interface TerminalPromptLineProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
  promptPrefix?: string;
  isFocused?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const TerminalPromptLine: React.FC<TerminalPromptLineProps> = ({
  value,
  onChangeText,
  onSubmitEditing,
  promptPrefix = '$',
  isFocused = true,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <MonoText size={Theme.fontSize.codeBase} color={Theme.colors.syntax.green} style={styles.prefix}>
        {promptPrefix}
      </MonoText>
      
      <TerminalTextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        autoFocus={isFocused}
        style={styles.input}
      />
      
      {isFocused && <TerminalCursor active={true} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: Theme.lineHeight.terminal,
  },
  prefix: {
    marginRight: Theme.spacing.xs,
  },
  input: {
    flexShrink: 1, // Allows input to take up space without pushing cursor off-screen
    minWidth: 10,
    color: 'transparent', // The TextInput handles logic, we overlay it or let it type natively if desired.
    // Assuming TerminalTextInput handles internal styles based on Phase 1.2
  },
});