import React from 'react';
import { TextStyle, StyleSheet, StyleProp } from 'react-native';
import { Theme } from '../../tokens';
import { SafeText } from './SafeText';

export interface LabelCapsTextProps {
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const LabelCapsText: React.FC<LabelCapsTextProps> = ({
  children,
  size = Theme.fontSize.labelSM,
  color,
  style,
}) => {
  return (
    <SafeText
      color={color}
      style={[
        styles.base,
        { fontSize: size },
        style,
      ]}
    >
      {children}
    </SafeText>
  );
};

const styles = StyleSheet.create({
  base: {
    textTransform: 'uppercase',
    letterSpacing: Theme.letterSpacing.caps,
    fontFamily: Theme.fontFamily.sansSemiBold,
  },
});