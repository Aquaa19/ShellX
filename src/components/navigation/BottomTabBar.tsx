import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../../tokens';

export interface BottomTabBarProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  children,
  style,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, Theme.spacing.xs) },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    minHeight: Theme.layout.bottomNavHeight,
    backgroundColor: Theme.colors.background.floor,
    borderTopWidth: Theme.borderWidth.hairline,
    borderTopColor: Theme.colors.border.subtle,
    ...Theme.noShadow,
  },
});