import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Animated, Easing } from 'react-native';
import { Theme } from '../../tokens';
import { StatusDot, MonoText, SecondaryActionButton } from '../../atoms';
import { MaterialIcon } from '../../atoms/icons';
import type { DotVariant } from '../../atoms';
import type { ConnectionState } from '../../types';

export interface ServerStatusSignalProps {
  state: ConnectionState;
  latencyMs?: number | null;
  onTest?: () => Promise<void>;
  isTesting?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ServerStatusSignal: React.FC<ServerStatusSignalProps> = ({
  state,
  latencyMs,
  onTest,
  isTesting = false,
  style,
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;
    if (isTesting) {
      animation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      animation.start();
    } else {
      spinValue.setValue(0);
    }
    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [isTesting, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getVariant = (): DotVariant => {
    switch (state) {
      case 'connected': return 'success';
      case 'connecting': return 'warning';
      case 'error': return 'error';
      case 'offline':
      case 'disconnected':
      default: return 'error';
    }
  };

  const getStatusText = () => {
    if (isTesting) return 'Testing connection...';
    if (state === 'connecting') return 'Connecting...';
    if (state === 'offline' || state === 'disconnected') return 'Disconnected / Offline';
    if (state === 'error') return 'Connection failed / Error';
    return 'Connected';
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.statusRow}>
        {isTesting ? (
          <View style={styles.iconWrapper}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <MaterialIcon name="refresh" size={18} color={Theme.colors.semantic.warning} />
            </Animated.View>
          </View>
        ) : (
          <StatusDot variant={getVariant()} />
        )}
        <MonoText size={Theme.fontSize.labelSM} color={Theme.colors.text.secondary} style={styles.text}>
          {getStatusText()}
        </MonoText>
        {!isTesting && latencyMs !== null && latencyMs !== undefined && (
          <MonoText size={Theme.fontSize.labelSM} color={Theme.colors.semantic.success} style={styles.latency}>
            ({latencyMs}ms)
          </MonoText>
        )}
      </View>
      <SecondaryActionButton 
        label="Test Connection" 
        onPress={() => onTest?.()} 
        disabled={isTesting || state === 'connecting'}
        style={styles.testBtn}
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
  iconWrapper: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginLeft: Theme.spacing.sm,
    marginRight: Theme.spacing.xs,
    flexShrink: 1,
  },
  latency: {
    fontFamily: Theme.fontFamily.mono,
  },
  testBtn: {
    minHeight: 44, // 44x44dp hit target minimum
  },
});