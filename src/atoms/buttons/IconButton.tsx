import React from 'react';
import { TouchableOpacity, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';

export interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  variant?: 'ghost' | 'outlined' | 'filled';
  active?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = Theme.layout.minTouchTarget,
  variant = 'ghost',
  active = false,
  disabled = false,
  style,
  testID,
}) => {
  const getVariantStyles = (): StyleProp<ViewStyle> => {
    switch (variant) {
      case 'outlined':
        return {
          borderWidth: Theme.borderWidth.hairline,
          borderColor: active ? Theme.colors.primary.default : Theme.colors.border.subtle,
          backgroundColor: 'transparent',
        };
      case 'filled':
        return {
          borderWidth: Theme.borderWidth.hairline,
          borderColor: active ? Theme.colors.primary.default : 'transparent',
          backgroundColor: Theme.colors.surface.raised,
        };
      case 'ghost':
      default:
        return {
          borderWidth: Theme.borderWidth.hairline,
          borderColor: active ? Theme.colors.primary.default : 'transparent',
          backgroundColor: 'transparent',
        };
    }
  };

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.base,
        { width: size, height: size },
        getVariantStyles(),
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.iconWrapper}>{icon}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Theme.borderRadius.default,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.noShadow,
  },
  disabled: {
    opacity: 0.4,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});