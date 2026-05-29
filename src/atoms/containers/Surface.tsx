import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';

export type SurfaceLevel = 'floor' | 'default' | 'raised';

export interface SurfaceProps {
  children?: React.ReactNode;
  level?: SurfaceLevel;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const Surface: React.FC<SurfaceProps> = ({
  children,
  level = 'default',
  style,
  testID,
}) => {
  const getBackgroundColor = () => {
    switch (level) {
      case 'floor': return Theme.colors.background.floor;
      case 'raised': return Theme.colors.background.overlay;
      case 'default':
      default: return Theme.colors.background.elevated;
    }
  };

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Theme.borderRadius.none,
    borderWidth: Theme.borderWidth.none,
    ...Theme.noShadow,
  },
});