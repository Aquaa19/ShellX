import React from 'react';
import { TouchableOpacity, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { BodyText } from '../../atoms';

export interface SideNavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export const SideNavItem: React.FC<SideNavItemProps> = ({
  icon,
  label,
  active,
  onPress,
  accessibilityLabel,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      style={[
        styles.container,
        active && styles.activeContainer,
        style,
      ]}
    >
      {active && <View style={styles.indicator} />}
      <View style={styles.iconContainer}>{icon}</View>
      <BodyText
        size={Theme.fontSize.bodyMD}
        weight={active ? 'semiBold' : 'medium'}
        color={active ? Theme.colors.text.primary : Theme.colors.text.secondary}
      >
        {label}
      </BodyText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Theme.layout.sideNavItemHeight,
    paddingHorizontal: Theme.spacing.md,
    ...Theme.noShadow,
  },
  activeContainer: {
    backgroundColor: Theme.colors.surface.raised,
  },
  indicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: Theme.colors.primary.default,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
});