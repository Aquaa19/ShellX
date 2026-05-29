import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { AppHeader } from '../shell/AppHeader';
import { IconButton, MaterialIcon } from '../../atoms';

export interface FocusedHeaderProps {
  title: string;
  onBackPress: () => void;
  rightSlot?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const FocusedHeader: React.FC<FocusedHeaderProps> = ({
  title,
  onBackPress,
  rightSlot,
  style,
}) => {
  const BackIcon = (
    <MaterialIcon 
      name="chevron-left" 
      size={24} 
      color={Theme.colors.text.primary} 
    />
  );

  return (
    <AppHeader
      title={title}
      style={style}
      leftSlot={
        <IconButton
          icon={BackIcon}
          onPress={onBackPress}
          variant="ghost"
        />
      }
      rightSlot={rightSlot}
    />
  );
};