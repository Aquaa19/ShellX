import React, { useRef } from 'react';
import { ScrollView, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { TerminalCodeLine } from './TerminalCodeLine';
import { TerminalPromptLine } from './TerminalPromptLine';
import type { TerminalCodeLineProps } from './TerminalCodeLine';

export interface TerminalEditorProps {
  lines: TerminalCodeLineProps[];
  currentInput: string;
  onInputChange: (text: string) => void;
  onSubmit: () => void;
  style?: StyleProp<ViewStyle>;
}

export const TerminalEditor: React.FC<TerminalEditorProps> = ({
  lines,
  currentInput,
  onInputChange,
  onSubmit,
  style,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={[styles.container, style]}
      contentContainerStyle={styles.contentContainer}
      onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
      keyboardShouldPersistTaps="handled"
    >
      {lines.map((line, index) => (
        <TerminalCodeLine
          key={index}
          text={line.text}
          type={line.type}
          lineNumber={line.lineNumber}
        />
      ))}
      <TerminalPromptLine
        value={currentInput}
        onChangeText={onInputChange}
        onSubmitEditing={onSubmit}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.floor, // #000000
    ...Theme.noShadow,
  },
  contentContainer: {
    padding: Theme.spacing.md,
  },
});