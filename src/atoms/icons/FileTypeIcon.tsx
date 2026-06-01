import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { Theme } from '../../tokens';
import { MaterialIcon, IconSize } from './MaterialIcon';

export interface FileTypeIconProps {
  extension: string;
  size?: IconSize | number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const FileTypeIcon: React.FC<FileTypeIconProps> = ({
  extension,
  size = 'md',
  color = Theme.colors.text.secondary,
  style,
}) => {
  const getIconName = (ext: string): string => {
    const normalizedExt = ext.toLowerCase().replace('.', '');
    switch (normalizedExt) {
      case 'sh': return 'terminal';
      case 'txt': return 'article';
      case 'md': return 'description';
      case 'py': return 'code';
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx': return 'javascript';
      case 'json': return 'data-object';
      default: return 'insert-drive-file';
    }
  };

  return (
    <MaterialIcon
      name={getIconName(extension)}
      size={size}
      color={color}
      style={style}
    />
  );
};