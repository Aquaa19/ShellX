import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { TopMetricsBar } from './TopMetricsBar';
import { TerminalEditor } from './TerminalEditor';
import { VimStatusStrip } from './VimStatusStrip';
import { DeveloperKeyboardBar } from './DeveloperKeyboardBar';
import type { ConnectionState, TerminalLine, VimMode } from '../../types';

export interface TerminalWorkspaceProps {
  filepath: string;
  connectionState: ConnectionState;
  lines: TerminalLine[];
  currentInput: string;
  onInputChange: (text: string) => void;
  onSubmit: () => void;
  vimMode: VimMode;
  cursorRow: number;
  cursorCol: number;
  onKeyPress: (key: string) => void;
  promptPrefix?: string;
  bottomPadding?: number;
  style?: StyleProp<ViewStyle>;
  selection?: { start: number; end: number };
  onSelectionChange?: (event: any) => void;
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
  promptPrefix,
  bottomPadding = 0,
  style,
  selection,
  onSelectionChange,
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
          promptPrefix={promptPrefix}
          bottomPadding={bottomPadding}
          selection={selection}
          onSelectionChange={onSelectionChange}
        />
      </View>
      
      <VimStatusStrip
        mode={vimMode}
        filename={filepath}
        cursorLine={cursorRow}
        cursorCol={cursorCol}
        lineCount={lines.length}
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