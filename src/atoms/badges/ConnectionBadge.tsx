import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { StatusIndicatorBadge } from './StatusIndicatorBadge';
import { DotVariant } from './StatusDot';

export type ConnectionState = 'connected' | 'offline' | 'connecting' | 'error';

export interface ConnectionBadgeProps {
  state: ConnectionState;
  style?: StyleProp<ViewStyle>;
}

export const ConnectionBadge: React.FC<ConnectionBadgeProps> = ({
  state,
  style,
}) => {
  const getProps = (): { variant: DotVariant; label: string } => {
    switch (state) {
      case 'connected': return { variant: 'success', label: 'CONNECTED' };
      case 'offline': return { variant: 'error', label: 'OFFLINE' };
      case 'connecting': return { variant: 'warning', label: 'CONNECTING' };
      case 'error': return { variant: 'error', label: 'ERROR' };
      default: return { variant: 'error', label: 'OFFLINE' };
    }
  };

  const config = getProps();

  return (
    <StatusIndicatorBadge
      variant={config.variant}
      label={config.label}
      style={style}
    />
  );
};