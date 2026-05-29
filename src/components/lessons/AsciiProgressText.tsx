import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { MonoText } from '../../atoms';

export interface AsciiProgressTextProps {
  progress: number; // 0 to 1
  length?: number; // Number of blocks, default 10
  style?: StyleProp<ViewStyle>;
}

export const AsciiProgressText: React.FC<AsciiProgressTextProps> = ({
  progress,
  length = 10,
  style,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const filledCount = Math.round(clampedProgress * length);
  const emptyCount = length - filledCount;
  
  const filledStr = '█'.repeat(filledCount);
  const emptyStr = '░'.repeat(emptyCount);
  const percentStr = Math.round(clampedProgress * 100).toString().padStart(3, ' ');

  return (
    <View style={[styles.container, style]} accessible={true} accessibilityLabel={`Progress: ${percentStr}%`}>
      <MonoText size={Theme.fontSize.codeBase} color={Theme.colors.syntax.green}>
        [{filledStr}
      </MonoText>
      <MonoText size={Theme.fontSize.codeBase} color={Theme.colors.text.tertiary}>
        {emptyStr}]
      </MonoText>
      <MonoText size={Theme.fontSize.codeBase} color={Theme.colors.text.secondary} style={styles.percent}>
        {percentStr}%
      </MonoText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percent: {
    marginLeft: Theme.spacing.xs,
  },
});