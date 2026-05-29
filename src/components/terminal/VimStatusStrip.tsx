import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { LabelCapsText, MonoText } from '../../atoms';

export type VimMode = 'NORMAL' | 'INSERT' | 'VISUAL';

export interface VimStatusStripProps {
  mode: VimMode;
  filename: string;
  cursorRow: number;
  cursorCol: number;
  style?: StyleProp<ViewStyle>;
}

export const VimStatusStrip: React.FC<VimStatusStripProps> = ({
  mode,
  filename,
  cursorRow,
  cursorCol,
  style,
}) => {
  const getModeColor = () => {
    switch (mode) {
      case 'INSERT': return Theme.colors.syntax.blue;
      case 'VISUAL': return Theme.colors.syntax.orange;
      case 'NORMAL':
      default: return Theme.colors.semantic.success;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.modeBlock, { backgroundColor: getModeColor() }]}>
        <LabelCapsText color={Theme.colors.background.floor}>{mode}</LabelCapsText>
      </View>
      <View style={styles.fileBlock}>
        <MonoText size={Theme.fontSize.labelSM} color={Theme.colors.text.secondary}>
          {filename}
        </MonoText>
      </View>
      <View style={styles.cursorBlock}>
        <MonoText size={Theme.fontSize.labelSM} color={Theme.colors.text.primary}>
          {cursorRow}:{cursorCol}
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
  cursorBlock: {
    paddingHorizontal: Theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});