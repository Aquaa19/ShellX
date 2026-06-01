import React, { useEffect, useRef } from 'react';
import { StyleSheet, StyleProp, ViewStyle, Pressable, Animated, View } from 'react-native';
import { Theme } from '../../tokens';
import { SafeText } from '../../atoms';

export interface BottomTabItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onPress: () => void;
  badgeCount?: number;
  style?: StyleProp<ViewStyle>;
}

export const BottomTabItem: React.FC<BottomTabItemProps> = ({
  icon,
  label,
  active,
  onPress,
  badgeCount,
  style,
}) => {
  const progress = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: active ? 1 : 0,
      damping: 14,
      stiffness: 120,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  }, [active, progress]);

  const iconStyle = {
    opacity: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    }),
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -6],
        }),
      },
    ],
  };

  const textStyle = {
    opacity: progress,
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [8, 0],
        }),
      },
      {
        scale: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.85, 1],
        }),
      },
    ],
  };

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, style]}
    >
      <Animated.View style={[styles.iconWrapper, iconStyle]}>
        {icon}
        {!!badgeCount && badgeCount > 0 && (
          <View style={styles.badge} />
        )}
      </Animated.View>
      <Animated.View style={[styles.labelWrapper, textStyle]}>
        <SafeText
          color={Theme.colors.primary.default}
          style={styles.label}
        >
          {label}
        </SafeText>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: Theme.layout.minTouchTarget,
    position: 'relative',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: Theme.layout.minTouchTarget,
    width: Theme.layout.minTouchTarget,
  },
  labelWrapper: {
    position: 'absolute',
    bottom: 6,
  },
  label: {
    fontFamily: Theme.fontFamily.sansBold,
    fontSize: Theme.fontSize.labelXS - 1,
    textTransform: 'uppercase',
    letterSpacing: Theme.letterSpacing.caps,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.semantic.error,
  },
});