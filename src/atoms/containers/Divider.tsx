import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  color = Theme.colors.border.subtle,
  style,
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <View
      style={[
        { backgroundColor: color },
        isHorizontal ? styles.horizontal : styles.vertical,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    height: Theme.layout.dividerThickness,
    width: '100%',
    ...Theme.noShadow,
  },
  vertical: {
    width: Theme.layout.dividerThickness,
    alignSelf: 'stretch',
    ...Theme.noShadow,
  },
});