import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { TopMetricsBar } from './TopMetricsBar';
import { TerminalEditor } from './TerminalEditor';
import { VimStatusStrip, VimMode } from './VimStatusStrip';
import { DeveloperKeyboardBar } from './DeveloperKeyboardBar';
import type { ConnectionState } from '../../atoms';
import type { TerminalCodeLineProps } from './TerminalCodeLine';

export interface TerminalWorkspaceProps {
  filepath: string;
  connectionState: ConnectionState;
  lines: TerminalCodeLineProps[];
  currentInput: string;
  onInputChange: (text: string) => void;
  onSubmit: () => void;
  vimMode: VimMode;
  cursorRow: number;
  cursorCol: number;
  onKeyPress: (key: string) => void;
  style?: StyleProp<ViewStyle>;
}

export const TerminalWorkspace: React.FC<TerminalWorkspaceProps> = ({
  filepath,
  connectionState,
  lines,
  currentInput,
  onInputChange,
  onSubmit,
  vimMode,
  cursorRow,
  cursorCol,
  onKeyPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <TopMetricsBar filepath={filepath} connectionState={connectionState} />
      
      <View style={styles.editorWrapper}>
        <TerminalEditor
          lines={lines}
          currentInput={currentInput}
          onInputChange={onInputChange}
          onSubmit={onSubmit}
        />
      </View>
      
      <VimStatusStrip
        mode={vimMode}
        filename={filepath}
        cursorRow={cursorRow}
        cursorCol={cursorCol}
      />
      <DeveloperKeyboardBar onKeyPress={onKeyPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.floor,
    ...Theme.noShadow,
  },
  editorWrapper: {
    flex: 1,
  },
});