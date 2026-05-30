import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../tokens';
import { LabelCapsText } from '../atoms';
import { useAppContext } from './AppContext';

export const NetworkBanner: React.FC = () => {
  const { isNetworkOnline } = useAppContext();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-40)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isNetworkOnline ? -40 : insets.top,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isNetworkOnline, translateY, insets.top]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, { transform: [{ translateY }] }]}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <LabelCapsText color={Theme.colors.background.floor}>
        NO NETWORK CONNECTION
      </LabelCapsText>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: Theme.colors.semantic.warning,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: Theme.zIndex.toast,
    ...Theme.noShadow,
  },
});