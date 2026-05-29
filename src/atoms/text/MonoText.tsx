import React from 'react';
import { TextStyle , StyleProp} from 'react-native';
import { Theme } from '../../tokens';
import { SafeText } from './SafeText';

export interface MonoTextProps {
  children: React.ReactNode;
  size?: number;
  weight?: 'regular' | 'medium' | 'bold';
  color?: string;
  lineHeight?: number;
  style?: StyleProp<TextStyle>;
  selectable?: boolean;
}

export const MonoText: React.FC<MonoTextProps> = ({
  children,
  size = Theme.fontSize.codeBase,
  weight = 'regular',
  color = Theme.colors.text.code,
  lineHeight = Theme.lineHeight.terminal,
  style,
  selectable,
}) => {
  const getFontFamily = () => {
    switch (weight) {
      case 'bold': return Theme.fontFamily.monoBold;
      case 'medium': return Theme.fontFamily.monoMedium;
      case 'regular':
      default: return Theme.fontFamily.mono;
    }
  };

  return (
    <SafeText
      color={color}
      selectable={selectable}
      style={[
        {
          fontFamily: getFontFamily(),
          fontSize: size,
          lineHeight: lineHeight,
        },
        style,
      ]}
    >
      {children}
    </SafeText>
  );
};