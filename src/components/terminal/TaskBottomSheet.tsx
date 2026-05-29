import React from 'react';
import { Animated, StyleSheet, StyleProp, ViewStyle, View } from 'react-native';
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
  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY }] },
        style,
      ]}
    >
      <TaskSheetHeader title={title} onClose={onClose} />
      <View style={styles.content}>
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
    height: '60%', // Slides up to 60% of the screen
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