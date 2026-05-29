import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';

export interface TerminalCursorProps {
  active?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const TerminalCursor: React.FC<TerminalCursorProps> = ({
  active = true,
  style,
}) => {
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!active) {
      opacityAnim.setValue(0);
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
  }, [active, opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.cursor,
        { opacity: opacityAnim },
        style,
      ]}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    />
  );
};

const styles = StyleSheet.create({
  cursor: {
    width: Theme.layout.terminalCursorWidth, // 8
    height: Theme.layout.terminalCursorHeight, // 18
    backgroundColor: Theme.colors.primary.default,
    marginLeft: Theme.spacing.px,
    ...Theme.noShadow,
  },
});