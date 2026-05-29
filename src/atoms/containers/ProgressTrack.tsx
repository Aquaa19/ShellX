import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Animated } from 'react-native';
import { Theme } from '../../tokens';

export interface ProgressTrackProps {
  progress: number; // 0 to 1
  color?: string;
  trackColor?: string;
  style?: StyleProp<ViewStyle>;
}

export const ProgressTrack: React.FC<ProgressTrackProps> = ({
  progress,
  color = Theme.colors.semantic.success,
  trackColor = Theme.colors.border.subtle,
  style,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const animatedWidth = useRef(new Animated.Value(clampedProgress)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: clampedProgress,
      duration: 300,
      useNativeDriver: false, // width animation does not support native driver
    }).start();
  }, [clampedProgress, animatedWidth]);

  const widthInterpolation = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.track, { backgroundColor: trackColor }, style]}>
      <Animated.View
        style={[
          styles.fill,
          { 
            backgroundColor: color,
            width: widthInterpolation 
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: Theme.layout.progressBarHeight,
    borderRadius: Theme.borderRadius.full,
    width: '100%',
    overflow: 'hidden',
    ...Theme.noShadow,
  },
  fill: {
    height: '100%',
    borderRadius: Theme.borderRadius.full,
  },
});