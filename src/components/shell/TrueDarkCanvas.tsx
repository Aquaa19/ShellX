import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';

export interface TrueDarkCanvasProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const TrueDarkCanvas: React.FC<TrueDarkCanvasProps> = ({
  children,
  style,
  testID,
}) => {
  return (
    <View
      testID={testID}
      style={[styles.canvas, style]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: Theme.colors.background.floor, // #000000
    ...Theme.noShadow,
  },
});