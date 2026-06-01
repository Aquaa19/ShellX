import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Theme } from '../../tokens';
import { MonoText } from '../../atoms';

export interface ShellXSpinnerProps {
  label?: string;
  size?: 'normal' | 'small';
}

export const ShellXSpinner: React.FC<ShellXSpinnerProps> = ({ 
  label = 'ShellX', 
  size = 'normal' 
}) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [animValue]);

  const isSmall = size === 'small';
  const charCount = label.length;
  
  const fontSize = isSmall ? 14 : (charCount > 10 ? 20 : 32);
  const paddingHorizontal = isSmall ? 12 : 28;
  const charWidth = fontSize * 0.62;
  const containerWidth = Math.max(isSmall ? 80 : 150, charCount * charWidth + paddingHorizontal * 2);
  
  const lineHeight = isSmall ? 32 : 64;
  const dotSize = isSmall ? 4 : 10;
  const dotMaxHeight = isSmall ? 10 : 30;
  const dotMinHeight = isSmall ? 3 : 8;
  const dotMaxWidth = isSmall ? 12 : 30;

  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, containerWidth - dotSize],
  });

  const scaleX = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, dotMaxWidth / dotSize, 1],
  });

  const scaleY = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, dotMinHeight / dotMaxHeight, 1],
  });

  const animatedDotStyle = {
    transform: [
      { translateX },
      { scaleX },
      { scaleY },
    ],
  };

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      <Animated.View
        style={[
          styles.dot,
          styles.dotTop,
          {
            width: dotSize,
            height: dotMaxHeight,
          },
          animatedDotStyle,
        ]}
      />
      <MonoText 
        size={fontSize} 
        color={Theme.colors.syntax.green} 
        weight="bold"
        style={[styles.labelText, { paddingHorizontal, lineHeight, fontSize }]}
      >
        {label}
      </MonoText>
      <Animated.View
        style={[
          styles.dot,
          styles.dotBottom,
          {
            width: dotSize,
            height: dotMaxHeight,
          },
          animatedDotStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#000000',
  },
  dot: {
    position: 'absolute',
    left: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  dotTop: {
    top: 0,
  },
  dotBottom: {
    bottom: 0,
  },
  labelText: {
    textAlign: 'center',
  },
});

