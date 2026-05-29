import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { HeadlineText } from '../../atoms';

export interface ShellXLogoTextProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const ShellXLogoText: React.FC<ShellXLogoTextProps> = ({
  size = Theme.fontSize.headlineMD,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <HeadlineText size={size} weight="bold" color={Theme.colors.text.primary}>
        Shell
      </HeadlineText>
      <HeadlineText size={size} weight="bold" color={Theme.colors.primary.default}>
        X
      </HeadlineText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});