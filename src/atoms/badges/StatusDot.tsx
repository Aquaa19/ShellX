import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { Theme } from '../../tokens';

export type DotVariant = 'success' | 'warning' | 'error' | 'inactive' | 'primary';

export interface StatusDotProps {
  variant: DotVariant;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const StatusDot: React.FC<StatusDotProps> = ({
  variant,
  size = Theme.layout.statusDotSize,
  style,
}) => {
  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'success': return Theme.colors.semantic.success;
      case 'warning': return Theme.colors.semantic.warning;
      case 'error': return Theme.colors.semantic.error;
      case 'primary': return Theme.colors.primary.default;
      case 'inactive':
      default: return Theme.colors.text.tertiary;
    }
  };

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: Theme.borderRadius.full,
          backgroundColor: getBackgroundColor(),
        },
        Theme.noShadow,
        style,
      ]}
    />
  );
};