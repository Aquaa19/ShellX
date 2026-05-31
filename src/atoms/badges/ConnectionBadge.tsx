import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { StatusIndicatorBadge } from './StatusIndicatorBadge';
import { DotVariant } from './StatusDot';
import type { ConnectionState } from '../../types';

export type { ConnectionState };

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
      case 'connecting': return { variant: 'warning', label: 'CONNECTING' };
      case 'offline': return { variant: 'error', label: 'OFFLINE' };
      case 'error': return { variant: 'error', label: 'ERROR' };
      case 'disconnected':
      default: return { variant: 'inactive', label: 'OFFLINE' };
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