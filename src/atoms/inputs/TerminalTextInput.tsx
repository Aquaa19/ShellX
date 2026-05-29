import React from 'react';
import { TextInput, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { Theme } from '../../tokens';

export interface TerminalTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: (event: any) => void;
  placeholder?: string;
  autoFocus?: boolean;
  editable?: boolean;
  multiline?: boolean;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

export const TerminalTextInput: React.FC<TerminalTextInputProps> = ({
  value,
  onChangeText,
  onSubmitEditing,
  placeholder,
  autoFocus = false,
  editable = true,
  multiline = false,
  style,
  testID,
}) => {
  return (
    <TextInput
      testID={testID}
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      placeholder={placeholder}
      placeholderTextColor={Theme.colors.text.placeholder}
      autoFocus={autoFocus}
      editable={editable}
      multiline={multiline}
      autoCapitalize="none"
      autoCorrect={false}
      spellCheck={false}
      caretHidden={false}
      selectionColor={Theme.colors.primary.default}
      style={[styles.input, style]}
    />
  );
};

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