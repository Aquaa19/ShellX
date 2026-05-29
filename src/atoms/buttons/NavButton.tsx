import React from 'react';
import { TouchableOpacity, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { SafeText } from '../text/SafeText';

export interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onPress: () => void;
  badgeCount?: number;
  style?: StyleProp<ViewStyle>;
}

export const NavButton: React.FC<NavButtonProps> = ({
  icon,
  label,
  active,
  onPress,
  badgeCount,
  style,
}) => {
  const contentColor = active ? Theme.colors.primary.default : Theme.colors.text.tertiary;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.container, style]}
    >
      <View style={styles.iconContainer}>
        {icon}
        {!!badgeCount && badgeCount > 0 && (
          <View style={styles.badge}>
            {/* Extremely compact badge formatting for tight spaces */}
          </View>
        )}
      </View>
      <SafeText
        color={contentColor}
        style={styles.label}
      >
        {label}
      </SafeText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: Theme.layout.bottomNavHeight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Theme.spacing.xs,
    ...Theme.noShadow,
  },
  iconContainer: {
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: Theme.fontFamily.sansMedium,
    fontSize: Theme.fontSize.labelXS,
    textTransform: 'uppercase',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -6,
    width: 6,
    height: 6,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.semantic.error,
  },
});