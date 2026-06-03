import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, KeyboardTypeOptions } from 'react-native';
import { Theme } from '../../tokens';
import { LabelCapsText } from '../text/LabelCapsText';
import { IconTextInput } from './IconTextInput';
import { SafeText } from '../text/SafeText';

export interface ConfigInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ConfigInputField: React.FC<ConfigInputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  hint,
  error,
  keyboardType,
  disabled = false,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <LabelCapsText color={Theme.colors.text.secondary}>
        {label}
      </LabelCapsText>
      
      <IconTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        error={!!error}
        disabled={disabled}
      />
      
      {!!error && (
        <SafeText
          color={Theme.colors.semantic.error}
          style={styles.feedbackText}
        >
          {error}
        </SafeText>
      )}
      
      {!!hint && !error && (
        <SafeText
          color={Theme.colors.text.tertiary}
          style={styles.feedbackText}
        >
          {hint}
        </SafeText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: Theme.spacing.xs,
  },
  feedbackText: {
    fontFamily: Theme.fontFamily.sans,
    fontSize: Theme.fontSize.labelSM,
    marginTop: 2,
  },
});