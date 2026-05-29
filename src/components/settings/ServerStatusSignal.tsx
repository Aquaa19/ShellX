import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { StatusDot, MonoText, SecondaryActionButton } from '../../atoms';
import type { DotVariant } from '../../atoms'; // Extracted from Phase 1.2 StatusDot

export interface ServerStatusSignalProps {
  status: 'online' | 'offline' | 'checking';
  pingMs?: number;
  onTestPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const ServerStatusSignal: React.FC<ServerStatusSignalProps> = ({
  status,
  pingMs,
  onTestPress,
  style,
}) => {
  const getVariant = (): DotVariant => {
    switch (status) {
      case 'online': return 'success';
      case 'checking': return 'warning';
      case 'offline':
      default: return 'error';
    }
  };

  const getStatusText = () => {
    if (status === 'checking') return 'Checking connection...';
    if (status === 'offline') return 'Connection failed / Offline';
    return pingMs ? `Connected (${pingMs}ms latency)` : 'Connected';
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.statusRow}>
        <StatusDot variant={getVariant()} />
        <MonoText size={Theme.fontSize.labelSM} color={Theme.colors.text.secondary} style={styles.text}>
          {getStatusText()}
        </MonoText>
      </View>
      <SecondaryActionButton 
        label="Test Connection" 
        onPress={onTestPress} 
        disabled={status === 'checking'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.md,
    paddingTop: Theme.spacing.md,
    borderTopWidth: Theme.borderWidth.hairline,
    borderTopColor: Theme.colors.border.subtle,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    marginLeft: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
    flexShrink: 1,
  },
});