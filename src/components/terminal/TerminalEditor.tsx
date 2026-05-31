import React, { useRef, useEffect, useCallback, useState } from 'react';
import { FlatList, StyleSheet, StyleProp, ViewStyle, Pressable, TextInput } from 'react-native';
import { Theme } from '../../tokens';
import { TerminalCodeLine } from './TerminalCodeLine';
import { TerminalPromptLine } from './TerminalPromptLine';
import type { TerminalLine } from '../../types';

export interface TerminalEditorProps {
  lines: TerminalLine[];
  currentInput: string;
  onInputChange: (text: string) => void;
  onSubmit: () => void;
  promptPrefix?: string;
  style?: StyleProp<ViewStyle>;
}

export const TerminalEditor: React.FC<TerminalEditorProps> = ({
  lines,
  currentInput,
  onInputChange,
  onSubmit,
  promptPrefix,
  style,
}) => {
  const flatListRef = useRef<FlatList<TerminalLine>>(null);
  const inputRef = useRef<TextInput>(null);
  const [viewportHeight, setViewportHeight] = useState(0);

  // Auto-scroll on new lines
  useEffect(() => {
    if (lines.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [lines.length]);

  // Measure viewport height and auto-scroll on resize
  const handleLayout = useCallback((event: any) => {
    const { height } = event.nativeEvent.layout;
    setViewportHeight(height);
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);

  const renderItem = useCallback(({ item }: { item: TerminalLine }) => (
    <TerminalCodeLine line={item} />
  ), []);

  const itemsHeight = lines.length * Theme.lineHeight.terminal;
  const footerHeight = Math.max(50, viewportHeight - itemsHeight - Theme.spacing.md * 2);

  return (
    <FlatList
      ref={flatListRef}
      data={lines}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      style={[styles.container, style]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      onLayout={handleLayout}
      keyboardShouldPersistTaps="always"
      ListFooterComponentStyle={{ height: footerHeight }}
      ListFooterComponent={
        <Pressable style={styles.footerPressable} onPress={() => inputRef.current?.focus()}>
          <TerminalPromptLine
            ref={inputRef}
            value={currentInput}
            onChangeText={onInputChange}
            onSubmitEditing={onSubmit}
            promptPrefix={promptPrefix}
          />
        </Pressable>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.floor, // #000000
    ...Theme.noShadow,
  },
  contentContainer: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
  },
  footerPressable: {
    height: '100%',
    justifyContent: 'flex-start',
  },
});