import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { NavButton } from '../../atoms';

export interface BottomTabItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onPress: () => void;
  badgeCount?: number;
  style?: StyleProp<ViewStyle>;
}

export const BottomTabItem: React.FC<BottomTabItemProps> = ({
  icon,
  label,
  active,
  onPress,
  badgeCount,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {active && <View style={styles.indicator} />}
      <NavButton
        icon={icon}
        label={label}
        active={active}
        onPress={onPress}
        badgeCount={badgeCount}
        style={styles.navButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
  },
  indicator: {
    position: 'absolute',
    top: -1, // Sits exactly on the top border of the tab bar
    width: 16,
    height: 2,
    backgroundColor: Theme.colors.primary.default,
    borderRadius: Theme.borderRadius.full,
    zIndex: Theme.zIndex.base,
    ...Theme.noShadow,
  },
  navButton: {
    width: '100%',
    paddingTop: Theme.spacing.xs,
  },
});