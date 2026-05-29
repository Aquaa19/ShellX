import React from 'react';
import { TextStyle, StyleProp } from 'react-native';
import { Theme } from '../../tokens';
import { SafeText } from './SafeText';

export interface BodyTextProps {
  children: React.ReactNode;
  size?: number;
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const BodyText: React.FC<BodyTextProps> = ({
  children,
  size = Theme.fontSize.bodySM,
  weight = 'regular',
  color,
  style,
}) => {
  const getFontFamily = () => {
    switch (weight) {
      case 'bold': return Theme.fontFamily.sansBold;
      case 'semiBold': return Theme.fontFamily.sansSemiBold;
      case 'medium': return Theme.fontFamily.sansMedium;
      case 'regular':
      default: return Theme.fontFamily.sans;
    }
  };

  const calculatedLineHeight = size * Theme.lineHeight.normal;

  return (
    <SafeText
      color={color}
      style={[
        {
          fontFamily: getFontFamily(),
          fontSize: size,
          lineHeight: calculatedLineHeight,
        },
        style,
      ]}
    >
      {children}
    </SafeText>
  );
};