import React, { useState, useEffect } from 'react';
import { Animated, StyleSheet, StyleProp, ViewStyle, View, Keyboard, useWindowDimensions, Platform } from 'react-native';
import { Theme } from '../../tokens';
import { TaskSheetHeader } from './TaskSheetHeader';
import { TaskSheetActions } from './TaskSheetActions';

export interface TaskBottomSheetProps {
  title: string;
  translateY: Animated.Value;
  onClose: () => void;
  onCheck: () => void;
  onHint: () => void;
  isChecking?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const TaskBottomSheet: React.FC<TaskBottomSheetProps> = ({
  title,
  translateY,
  onClose,
  onCheck,
  onHint,
  isChecking,
  children,
  style,
}) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const sheetHeight = isKeyboardVisible 
    ? (isLandscape ? 64 : 250) 
    : (isLandscape ? '40%' : '55%');

  return (
    <Animated.View
      style={[
        styles.container,
        { 
          transform: [{ translateY }],
          height: sheetHeight,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <TaskSheetHeader title={title} onClose={onClose} />
      <View style={[
        styles.content,
        isKeyboardVisible && { paddingVertical: Theme.spacing.xs },
      ]}>
        {children}
      </View>
      <TaskSheetActions onCheck={onCheck} onHint={onHint} isChecking={isChecking} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Theme.colors.surface.default,
    borderTopLeftRadius: Theme.borderRadius.xl,
    borderTopRightRadius: Theme.borderRadius.xl,
    borderWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
    borderBottomWidth: 0,
    ...Theme.noShadow,
    zIndex: Theme.zIndex.taskSheet,
  },
  content: {
    flex: 1,
    padding: Theme.spacing.md,
  },
});