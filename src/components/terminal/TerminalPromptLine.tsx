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
  const handleTextChange = (text: string) => {
    if (text.includes('\n')) {
      const cleanedText = text.replace(/\n/g, '');
      onChangeText(cleanedText);
      if (onSubmitEditing) {
        onSubmitEditing();
      }
    } else {
      onChangeText(text);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <MonoText size={Theme.fontSize.codeBase} color={Theme.colors.syntax.green} style={styles.prefix}>
        {promptPrefix}
      </MonoText>
      
      <View style={styles.inputContainer}>
        <TerminalTextInput
          ref={ref}
          value={value}
          onChangeText={handleTextChange}
          onSubmitEditing={onSubmitEditing}
          autoFocus={isFocused}
          multiline={true}
          blurOnSubmit={false}
          style={styles.inlineInput}
        />
        
        <View style={styles.textOverlay} pointerEvents="none">
          <MonoText size={Theme.fontSize.codeBase} color={Theme.colors.syntax.white}>
            {value}
            {isFocused && <TerminalCursor active={true} />}
          </MonoText>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    minHeight: Theme.lineHeight.terminal,
  },
  prefix: {
    marginRight: Theme.spacing.xs,
  },
  inputContainer: {
    flexGrow: 1,
    minWidth: 150,
    position: 'relative',
  },
  inlineInput: {
    width: '100%',
    color: 'transparent',
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
    minHeight: Theme.lineHeight.terminal,
  },
  textOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
  },
});