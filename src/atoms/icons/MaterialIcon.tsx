import React from 'react';
import { StyleProp, TextStyle, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Theme } from '../../tokens';

export type IconSize = 'sm' | 'md' | 'lg';

export interface MaterialIconProps {
  name: string;
  size?: IconSize | number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  size = 'md',
  color = Theme.colors.text.secondary,
  style,
}) => {
  const getNumericSize = (): number => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'sm': return 16;
      case 'lg': return 24;
      case 'md':
      default: return 18;
    }
  };

  return (
    <Icon
      name={name}
      size={getNumericSize()}
      color={color}
      style={[styles.base, style]}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    ...Theme.noShadow,
  },
});