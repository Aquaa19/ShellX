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
  selection?: { start: number; end: number };
  onSelectionChange?: (event: any) => void;
}

export const TerminalPromptLine = React.forwardRef<TextInput, TerminalPromptLineProps>(({
  value,
  onChangeText,
  onSubmitEditing,
  promptPrefix = '$',
  isFocused = true,
  style,
  selection,
  onSelectionChange,
}, ref) => {
  const [cursorIndex, setCursorIndex] = React.useState(value.length);

  React.useEffect(() => {
    if (cursorIndex > value.length) {
      setCursorIndex(value.length);
    }
  }, [value, cursorIndex]);

  const handleSelectionChange = (e: any) => {
    setCursorIndex(e.nativeEvent.selection.start);
    if (onSelectionChange) {
      onSelectionChange(e);
    }
  };

  const safeCursorIndex = Math.min(cursorIndex, value.length);
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
          selection={selection}
          onSelectionChange={handleSelectionChange}
        />
        
        <View style={styles.textOverlay} pointerEvents="none">
          <MonoText size={Theme.fontSize.codeBase} color={Theme.colors.syntax.white}>
            {value.slice(0, safeCursorIndex)}
            {isFocused && <TerminalCursor active={true} />}
            {value.slice(safeCursorIndex)}
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