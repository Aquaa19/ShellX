import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { Divider } from '../../atoms';

export interface KeyboardDividerProps {
  style?: StyleProp<ViewStyle>;
}

export const KeyboardDivider: React.FC<KeyboardDividerProps> = ({ style }) => {
  return (
    <Divider 
      orientation="horizontal" 
      color={Theme.colors.border.strong} 
      style={[styles.divider, style]} 
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});