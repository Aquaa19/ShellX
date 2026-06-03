import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { PrimaryActionButton } from '../../atoms';

export interface SaveConfigurationButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const SaveConfigurationButton: React.FC<SaveConfigurationButtonProps> = ({
  onPress,
  isLoading = false,
  disabled = false,
  style,
}) => {
  return (
    <PrimaryActionButton
      label=":w  SAVE"
      onPress={onPress}
      loading={isLoading}
      disabled={disabled}
      fullWidth
      style={style}
      testID="btn-save-config"
    />
  );
};