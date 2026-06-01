import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../../tokens';

export interface BottomTabBarProps {
  children: React.ReactNode;
  activeIndex: number;
  totalTabs: number;
  style?: StyleProp<ViewStyle>;
}

const INDICATOR_HEIGHT = 48;
const INDICATOR_WIDTH = 80;

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  children,
  activeIndex,
  totalTabs,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const [containerWidth, setContainerWidth] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const leftEdge = useRef(new Animated.Value(0)).current;
  const rightEdge = useRef(new Animated.Value(0)).current;
  const prevIndexRef = useRef(activeIndex);

  useEffect(() => {
    if (containerWidth === 0 || totalTabs === 0) return;

    const TAB_WIDTH = containerWidth / totalTabs;
    const targetLeft = (TAB_WIDTH * activeIndex) + (TAB_WIDTH / 2) - (INDICATOR_WIDTH / 2);
    const targetRight = targetLeft + INDICATOR_WIDTH;

    if (!isInitialized) {
      leftEdge.setValue(targetLeft);
      rightEdge.setValue(targetRight);
      setIsInitialized(true);
      prevIndexRef.current = activeIndex;
      return;
    }

    const isMovingRight = activeIndex > prevIndexRef.current;
    prevIndexRef.current = activeIndex;

    leftEdge.stopAnimation();
    rightEdge.stopAnimation();

    if (isMovingRight) {
      Animated.parallel([
        Animated.spring(rightEdge, {
          toValue: targetRight,
          stiffness: 160,
          damping: 15,
          mass: 0.8,
          useNativeDriver: true,
        }),
        Animated.spring(leftEdge, {
          toValue: targetLeft,
          stiffness: 80,
          damping: 15,
          mass: 0.8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(leftEdge, {
          toValue: targetLeft,
          stiffness: 160,
          damping: 15,
          mass: 0.8,
          useNativeDriver: true,
        }),
        Animated.spring(rightEdge, {
          toValue: targetRight,
          stiffness: 80,
          damping: 15,
          mass: 0.8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [activeIndex, containerWidth, totalTabs, isInitialized, leftEdge, rightEdge]);

  // Compute center = (leftEdge + rightEdge) / 2
  const center = Animated.multiply(Animated.add(leftEdge, rightEdge), 0.5);
  // Compute translateX = center - baseCenter = center - (INDICATOR_WIDTH / 2)
  const translateX = Animated.subtract(center, INDICATOR_WIDTH / 2);
  // Compute scaleX = (rightEdge - leftEdge) / INDICATOR_WIDTH
  const scaleX = Animated.multiply(Animated.subtract(rightEdge, leftEdge), 1 / INDICATOR_WIDTH);

  const indicatorStyle = {
    transform: [
      { translateX },
      { scaleX },
      { rotate: '0.01deg' }, // Resolves Android layout sub-pixel line rendering artifact by forcing clean rasterization
    ],
    opacity: isInitialized ? 1 : 0,
  };

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, Theme.spacing.xs) },
        style,
      ]}
    >
      <View
        style={styles.tabContent}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      >
        <Animated.View style={[styles.slidingIndicator, indicatorStyle]} />
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: Theme.layout.bottomNavHeight,
    backgroundColor: Theme.colors.background.floor,
    borderTopWidth: Theme.borderWidth.hairline,
    borderTopColor: Theme.colors.border.subtle,
    ...Theme.noShadow,
  },
  tabContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'relative',
    height: Theme.layout.bottomNavHeight,
  },
  slidingIndicator: {
    position: 'absolute',
    left: 0,
    width: INDICATOR_WIDTH,
    height: INDICATOR_HEIGHT,
    borderRadius: INDICATOR_HEIGHT / 2,
    backgroundColor: Theme.colors.primary.muted,
    top: (Theme.layout.bottomNavHeight - INDICATOR_HEIGHT) / 2,
    ...Theme.noShadow,
  },
});