import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { KeyboardDivider } from './KeyboardDivider';
import { DeveloperKeyboardRow } from './DeveloperKeyboardRow';
import { ANSI } from '../../services/terminal/AnsiSequences';

export interface KeyDef {
  label:    string;           // Display label on the key chip
  sequence: string;           // ANSI sequence to send
  wide?:    boolean;
  special?: boolean;          // Styled as a modifier key
}

export const DEFAULT_KEYS: KeyDef[] = [
  { label: 'ESC',   sequence: ANSI.ESC,         special: true  },
  { label: 'TAB',   sequence: ANSI.TAB                         },
  { label: 'CTRL+C',sequence: ANSI.CTRL_C,       special: true  },
  { label: 'CTRL+D',sequence: ANSI.CTRL_D,       special: true  },
  { label: 'CTRL+Z',sequence: ANSI.CTRL_Z,       special: true  },
  { label: 'CTRL+L',sequence: ANSI.CTRL_L                      },
  { label: 'CTRL+R',sequence: ANSI.CTRL_R                      },
  { label: '|',     sequence: ANSI.PIPE                         },
  { label: '~',     sequence: ANSI.TILDE                        },
  { label: '/',     sequence: ANSI.FSLASH                       },
  { label: '\\',    sequence: ANSI.BSLASH                       },
  { label: '&',     sequence: ANSI.AMPERSAND                    },
  { label: ';',     sequence: ANSI.SEMICOLON                    },
  { label: '↑',     sequence: ANSI.ARROW_UP                     },
  { label: '↓',     sequence: ANSI.ARROW_DOWN                   },
  { label: '←',     sequence: ANSI.ARROW_LEFT                   },
  { label: '→',     sequence: ANSI.ARROW_RIGHT                  },
];

export interface DeveloperKeyboardBarProps {
  onKeyPress: (sequence: string) => void;
  style?: StyleProp<ViewStyle>;
}

export const DeveloperKeyboardBar: React.FC<DeveloperKeyboardBarProps> = ({
  onKeyPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <KeyboardDivider />
      <DeveloperKeyboardRow keys={DEFAULT_KEYS} onKeyPress={onKeyPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Theme.layout.developerKeyboardBarHeight, // 56
    backgroundColor: Theme.colors.background.elevated,
    ...Theme.noShadow,
  },
});