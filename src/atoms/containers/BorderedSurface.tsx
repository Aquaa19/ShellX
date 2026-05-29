import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { Surface, SurfaceLevel } from './Surface';

export interface BorderedSurfaceProps {
  children?: React.ReactNode;
  level?: SurfaceLevel;
  borderColor?: string;
  borderRadius?: number;
  focused?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const BorderedSurface: React.FC<BorderedSurfaceProps> = ({
  children,
  level = 'default',
  borderColor = Theme.colors.border.subtle,
  borderRadius = Theme.borderRadius.lg,
  focused = false,
  style,
  testID,
}) => {
  const resolvedBorderColor = focused ? Theme.colors.border.focus : borderColor;

  return (
    <Surface
      testID={testID}
      level={level}
      style={[
        styles.base,
        { 
          borderColor: resolvedBorderColor,
          borderRadius: borderRadius 
        },
        style,
      ]}
    >
      {children}
    </Surface>
  );
};

const styles = StyleSheet.create({
  base: {
    borderWidth: Theme.borderWidth.hairline,
  },
});