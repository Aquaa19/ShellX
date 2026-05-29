import React from 'react';
import { TouchableOpacity, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { BodyText, MaterialIcon } from '../../atoms';

export interface GoogleSignInButtonProps {
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onPress,
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Sign in with Google"
      style={[
        styles.container,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcon name="language" size={20} color={Theme.colors.text.inverse} />
        </View>
        <BodyText
          weight="semiBold"
          size={Theme.fontSize.bodySM}
          color={Theme.colors.text.inverse}
        >
          Sign in with Google
        </BodyText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: Theme.layout.comfortTouchTarget,
    width: '100%',
    backgroundColor: Theme.colors.text.primary, // White-ish button for high contrast
    borderRadius: Theme.borderRadius.default,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: Theme.borderWidth.none,
    ...Theme.noShadow,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: Theme.spacing.sm,
  },
});