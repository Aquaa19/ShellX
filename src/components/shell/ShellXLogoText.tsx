import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { MonoText } from '../../atoms';

export interface ShellXLogoTextProps {
  size?: number;
  text?: string;
  style?: StyleProp<ViewStyle>;
}

export const ShellXLogoText: React.FC<ShellXLogoTextProps> = ({
  size = Theme.fontSize.titleLG,
  text = 'ShellX_Terminal',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <MonoText
        size={size}
        weight="bold"
        color={Theme.colors.semantic.success}
      >
        {text}
      </MonoText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});