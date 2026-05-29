import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { Theme } from '../../tokens';
import { MaterialIcon, IconSize } from './MaterialIcon';

export interface FolderIconProps {
  open?: boolean;
  size?: IconSize | number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const FolderIcon: React.FC<FolderIconProps> = ({
  open = false,
  size = 'md',
  color = Theme.colors.syntax.orange,
  style,
}) => {
  return (
    <MaterialIcon
      name={open ? 'folder_open' : 'folder'}
      size={size}
      color={color}
      style={style}
    />
  );
};