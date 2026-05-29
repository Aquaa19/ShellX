import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { PrimaryActionButton } from '../../atoms';

export interface SaveConfigurationButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const SaveConfigurationButton: React.FC<SaveConfigurationButtonProps> = ({
  onPress,
  isLoading = false,
  style,
}) => {
  return (
    <PrimaryActionButton
      label=":w  SAVE CONFIGURATION"
      onPress={onPress}
      loading={isLoading}
      fullWidth
      style={style}
      testID="btn-save-config"
    />
  );
};