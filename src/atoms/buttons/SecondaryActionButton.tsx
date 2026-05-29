import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { BodyText } from '../text/BodyText';

export interface SecondaryActionButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const SecondaryActionButton: React.FC<SecondaryActionButtonProps> = ({
  label,
  onPress,
  disabled = false,
  fullWidth = false,
  leftIcon,
  style,
  testID,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={disabled}
      activeOpacity={1} // We handle visual changes manually
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        isPressed && styles.pressedContainer,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <BodyText
          weight="semiBold"
          size={Theme.fontSize.bodySM}
          color={Theme.colors.text.primary}
        >
          {label}
        </BodyText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: Theme.layout.minTouchTarget,
    backgroundColor: Theme.colors.surface.default,
    borderWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
    borderRadius: Theme.borderRadius.default,
    paddingHorizontal: Theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.noShadow,
  },
  pressedContainer: {
    backgroundColor: Theme.colors.surface.active,
    borderColor: Theme.colors.border.strong,
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