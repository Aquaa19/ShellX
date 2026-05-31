import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { LabelCapsText, MonoText } from '../../atoms';
import type { VimMode } from '../../types';

export interface VimStatusStripProps {
  mode:       VimMode;            // 'NORMAL' | 'INSERT' | 'VISUAL' | 'COMMAND'
  filename?:  string;
  cursorLine: number;             // 1-based line number
  cursorCol:  number;             // 1-based column number
  lineCount:  number;             // Total lines in terminal output
  style?:     StyleProp<ViewStyle>;
}

export const VimStatusStrip: React.FC<VimStatusStripProps> = ({
  mode,
  filename,
  cursorLine,
  cursorCol,
  lineCount,
  style,
}) => {
  const getModeBgColor = () => {
    switch (mode) {
      case 'NORMAL': return Theme.colors.surface.raised;
      case 'INSERT': return Theme.colors.primary.default;
      case 'VISUAL': return Theme.colors.semantic.warning;
      case 'COMMAND': return Theme.colors.semantic.info;
      default: return Theme.colors.surface.raised;
    }
  };

  const getModeTextColor = () => {
    if (mode === 'INSERT') return Theme.colors.text.inverse;
    return Theme.colors.text.primary;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.modeBlock, { backgroundColor: getModeBgColor() }]}>
        <LabelCapsText color={getModeTextColor()}>{mode}</LabelCapsText>
      </View>
      <View style={styles.fileBlock}>
        <MonoText size={Theme.fontSize.labelSM} color={Theme.colors.text.secondary}>
          {filename || 'untitled'}
        </MonoText>
      </View>
      <View style={styles.rightBlock}>
        <MonoText size={Theme.fontSize.labelXS} color={Theme.colors.text.secondary} style={styles.metrics}>
          Ln {cursorLine}, Col {cursorCol}
        </MonoText>
        <MonoText size={Theme.fontSize.labelXS} color={Theme.colors.text.secondary} style={styles.metrics}>
          {lineCount}L
        </MonoText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: Theme.layout.vimStatusStripHeight, // 32
    backgroundColor: Theme.colors.background.elevated,
    borderTopWidth: Theme.borderWidth.hairline,
    borderTopColor: Theme.colors.border.subtle,
    ...Theme.noShadow,
  },
  modeBlock: {
    paddingHorizontal: Theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileBlock: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.sm,
  },
  rightBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.sm,
  },
  metrics: {
    marginLeft: Theme.spacing.sm,
  },
});