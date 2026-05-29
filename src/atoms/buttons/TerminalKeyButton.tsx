import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { MonoText } from '../text/MonoText';

export interface TerminalKeyButtonProps {
  label: string;
  onPress: () => void;
  wide?: boolean;
  special?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const TerminalKeyButton: React.FC<TerminalKeyButtonProps> = ({
  label,
  onPress,
  wide = false,
  special = false,
  style,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  // Dynamic styling resolution
  const getBackgroundColor = () => {
    if (isPressed) return Theme.colors.primary.dim;
    if (special) return Theme.colors.primary.muted;
    return Theme.colors.surface.raised;
  };

  const getBorderColor = () => {
    if (isPressed) return Theme.colors.primary.default;
    return Theme.colors.border.subtle;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={1}
      style={[
        styles.base,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          minWidth: wide ? 64 : Theme.layout.minTouchTarget,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        <MonoText
          size={Theme.fontSize.labelSM}
          color={isPressed ? Theme.colors.text.primary : Theme.colors.text.secondary}
          style={styles.label}
        >
          {label}
        </MonoText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: Theme.layout.developerKeyboardBarHeight - 12,
    borderRadius: Theme.borderRadius.sm,
    borderWidth: Theme.borderWidth.hairline,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xs,
    ...Theme.noShadow,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    textAlign: 'center',
  },
});