import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TextInput } from 'react-native';
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

export const TerminalPromptLine = React.forwardRef<TextInput, TerminalPromptLineProps>(({
  value,
  onChangeText,
  onSubmitEditing,
  promptPrefix = '$',
  isFocused = true,
  style,
}, ref) => {
  return (
    <View style={[styles.container, style]}>
      <MonoText size={Theme.fontSize.codeBase} color={Theme.colors.syntax.green} style={styles.prefix}>
        {promptPrefix}
      </MonoText>
      
      <View style={styles.inputContainer}>
        <TerminalTextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          autoFocus={isFocused}
          style={styles.inlineInput}
        />
        
        <View style={styles.textOverlay} pointerEvents="none">
          <MonoText size={Theme.fontSize.codeBase} color={Theme.colors.syntax.white}>
            {value}
          </MonoText>
          {isFocused && <TerminalCursor active={true} />}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: Theme.lineHeight.terminal,
  },
  prefix: {
    marginRight: Theme.spacing.xs,
  },
  inputContainer: {
    flex: 1,
    position: 'relative',
  },
  inlineInput: {
    width: '100%',
    color: 'transparent',
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
    height: Theme.lineHeight.terminal,
  },
  textOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});