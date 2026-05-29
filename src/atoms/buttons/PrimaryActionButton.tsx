import React from 'react';
import { TouchableOpacity, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { BodyText } from '../text/BodyText';

export interface PrimaryActionButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const PrimaryActionButton: React.FC<PrimaryActionButtonProps> = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  style,
  testID,
}) => {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <BodyText
          weight="semiBold"
          size={Theme.fontSize.bodySM}
          color={Theme.colors.text.inverse}
        >
          {loading ? 'LOADING...' : label}
        </BodyText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: Theme.layout.minTouchTarget,
    backgroundColor: Theme.colors.primary.default,
    borderRadius: Theme.borderRadius.default,
    paddingHorizontal: Theme.spacing.md,
    borderWidth: Theme.borderWidth.none,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.noShadow,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: Theme.spacing.sm,
  },
});