import React, { useState } from 'react';
import { View, TextInput, StyleSheet, StyleProp, ViewStyle, TextStyle, KeyboardTypeOptions } from 'react-native';
import { Theme } from '../../tokens';

export interface IconTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  focused?: boolean;
  error?: boolean;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export const IconTextInput: React.FC<IconTextInputProps> = ({
  value,
  onChangeText,
  placeholder,
  leftIcon,
  rightIcon,
  focused: externalFocused,
  error = false,
  disabled = false,
  secureTextEntry = false,
  keyboardType = 'default',
  style,
  inputStyle,
  testID,
}) => {
  const [internalFocused, setInternalFocused] = useState(false);
  
  const isFocused = externalFocused !== undefined ? externalFocused : internalFocused;

  const getBorderColor = () => {
    if (error) return Theme.colors.border.error;
    if (isFocused) return Theme.colors.border.focus;
    return Theme.colors.border.subtle;
  };

  return (
    <View
      style={[
        styles.container,
        { borderColor: getBorderColor() },
        disabled && styles.disabled,
        style,
      ]}
    >
      {leftIcon && <View style={styles.iconSlot}>{leftIcon}</View>}
      
      <TextInput
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Theme.colors.text.placeholder}
        editable={!disabled}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        onFocus={() => setInternalFocused(true)}
        onBlur={() => setInternalFocused(false)}
        autoCapitalize="none"
        autoCorrect={false}
        selectionColor={Theme.colors.primary.default}
        style={[styles.input, inputStyle]}
      />
      
      {rightIcon && <View style={styles.iconSlot}>{rightIcon}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: Theme.layout.minTouchTarget,
    backgroundColor: Theme.colors.background.input,
    borderWidth: Theme.borderWidth.hairline,
    borderRadius: Theme.borderRadius.default,
    paddingHorizontal: Theme.spacing.sm,
    ...Theme.noShadow,
  },
  disabled: {
    opacity: 0.4,
  },
  iconSlot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontFamily: Theme.fontFamily.mono,
    fontSize: Theme.fontSize.bodySM,
    color: Theme.colors.text.primary,
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.xs,
  },
});