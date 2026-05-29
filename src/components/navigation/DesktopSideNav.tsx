import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';

export interface DesktopSideNavProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const DesktopSideNav: React.FC<DesktopSideNavProps> = ({
  children,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Theme.layout.sideNavWidth,
    height: '100%',
    backgroundColor: Theme.colors.background.floor,
    borderRightWidth: Theme.borderWidth.hairline,
    borderRightColor: Theme.colors.border.subtle,
    ...Theme.noShadow,
  },
});