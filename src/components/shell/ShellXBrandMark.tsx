import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { MonoText } from '../../atoms';

export interface ShellXBrandMarkProps {
  animated?: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const ShellXBrandMark: React.FC<ShellXBrandMarkProps> = ({
  animated = true,
  size = Theme.fontSize.headlineLG,
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

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <MonoText size={size} weight="bold" color={Theme.colors.text.primary}>
          $_
        </MonoText>
        <Animated.View
          style={[
            styles.cursor,
            {
              height: size,
              width: size * 0.5,
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