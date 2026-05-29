import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { BorderedSurface } from './BorderedSurface';

export interface TerminalPanelProps {
  children?: React.ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const TerminalPanel: React.FC<TerminalPanelProps> = ({
  children,
  fullWidth = false,
  style,
}) => {
  return (
    <BorderedSurface
      level="default"
      borderRadius={Theme.borderRadius.lg}
      style={[
        styles.base,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {children}
    </BorderedSurface>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
});