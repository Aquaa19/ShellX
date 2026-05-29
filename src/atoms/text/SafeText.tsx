import React from 'react';
import { Text, TextStyle, StyleSheet, TextProps, StyleProp } from 'react-native';
import { Theme } from '../../tokens';

export interface SafeTextProps extends TextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  color?: string;
  numberOfLines?: number;
  selectable?: boolean;
  testID?: string;
}

export const SafeText: React.FC<SafeTextProps> = ({
  children,
  style,
  color = Theme.colors.text.primary,
  numberOfLines,
  selectable,
  testID,
  ...rest
}) => {
  return (
    <Text
      testID={testID}
      numberOfLines={numberOfLines}
      selectable={selectable}
      style={[
        styles.base,
        { color },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: Theme.fontFamily.sans,
    ...Theme.noShadow,
  },
});