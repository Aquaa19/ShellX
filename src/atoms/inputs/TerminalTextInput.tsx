import React from 'react';
import { TextInput, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { Theme } from '../../tokens';

export interface TerminalTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: (event: any) => void;
  onKeyPress?: (event: any) => void;
  placeholder?: string;
  autoFocus?: boolean;
  editable?: boolean;
  multiline?: boolean;
  blurOnSubmit?: boolean;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

export const TerminalTextInput = React.forwardRef<TextInput, TerminalTextInputProps>(({
  value,
  onChangeText,
  onSubmitEditing,
  onKeyPress,
  placeholder,
  autoFocus = false,
  editable = true,
  multiline = false,
  blurOnSubmit,
  style,
  testID,
}, ref) => {
  return (
    <TextInput
      ref={ref}
      testID={testID}
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      placeholderTextColor={Theme.colors.text.placeholder}
      autoFocus={autoFocus}
      editable={editable}
      multiline={multiline}
      blurOnSubmit={blurOnSubmit}
      autoCapitalize="none"
      autoCorrect={false}
      spellCheck={false}
      keyboardType={multiline ? 'default' : 'visible-password'}
      autoComplete="off"
      importantForAutofill="no"
      textContentType="none"
      caretHidden={true}
      selectionColor="transparent"
      style={[styles.input, style]}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    backgroundColor: Theme.colors.background.input,
    fontFamily: Theme.fontFamily.mono,
    fontSize: Theme.fontSize.codeBase,
    color: Theme.colors.text.code,
    borderWidth: Theme.borderWidth.none,
    padding: 0,
    margin: 0,
    ...Theme.noShadow,
  },
});