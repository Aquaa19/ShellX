import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { MonoText } from '../../atoms';

export interface ShellXBrandMarkProps {
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg' | number;
  style?: StyleProp<ViewStyle>;
}

export const ShellXBrandMark: React.FC<ShellXBrandMarkProps> = ({
  animated = true,
  size = 'lg',
  style,
}) => {
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animated) {
      opacityAnim.setValue(1);
      return;
    }

    const blink = Animated.sequence([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(blink).start();
  }, [animated, opacityAnim]);

  // Resolve size to a number for typography
  const resolvedSize = typeof size === 'number'
    ? size
    : size === 'sm'
      ? Theme.fontSize.titleMD // 16
      : size === 'md'
        ? Theme.fontSize.headlineMD // 24
        : 48; // 'lg' size matches the Auth screen (48)

  // Determine cursor dimensions
  const cursorHeight = resolvedSize * 0.85; // Proportional to capital letter height
  const cursorWidth = typeof size === 'number'
    ? Math.max(4, resolvedSize * 0.15)
    : Theme.layout.terminalCursorWidth; // 8dp standard

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <MonoText
          size={resolvedSize}
          weight="bold"
          color={Theme.colors.text.primary}
          lineHeight={resolvedSize * 1.15} // Explicit line height to prevent vertical clipping on Android
        >
          $_
        </MonoText>
        <Animated.View
          style={[
            styles.cursor,
            {
              height: cursorHeight,
              width: cursorWidth,
              opacity: opacityAnim,
              backgroundColor: Theme.colors.primary.default,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cursor: {
    marginLeft: Theme.spacing.xxs,
    ...Theme.noShadow,
  },
});