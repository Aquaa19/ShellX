import React from 'react';
import { TextStyle, StyleProp } from 'react-native';
import { Theme } from '../../tokens';
import { SafeText } from './SafeText';

export interface HeadlineTextProps {
  children: React.ReactNode;
  size?: number;
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const HeadlineText: React.FC<HeadlineTextProps> = ({
  children,
  size = Theme.fontSize.headlineSM,
  weight = 'bold',
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

  const actualSize = Math.min(size, Theme.fontSize.headlineLG);

  return (
    <SafeText
      color={color}
      adjustsFontSizeToFit={true}
      minimumFontScale={0.8}
      style={[
        {
          fontFamily: getFontFamily(),
          fontSize: actualSize,
        },
        style,
      ]}
    >
      {children}
    </SafeText>
  );
};