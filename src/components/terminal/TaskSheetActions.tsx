import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { PrimaryActionButton, SecondaryActionButton } from '../../atoms';

export interface TaskSheetActionsProps {
  onCheck: () => void;
  onHint: () => void;
  isChecking?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const TaskSheetActions: React.FC<TaskSheetActionsProps> = ({
  onCheck,
  onHint,
  isChecking = false,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.buttonWrapper}>
        <SecondaryActionButton
          label="Hint"
          onPress={onHint}
          fullWidth
          testID="btn-hint"
        />
      </View>
      <View style={styles.gap} />
      <View style={styles.buttonWrapper}>
        <PrimaryActionButton
          label="Verify Task"
          onPress={onCheck}
          loading={isChecking}
          fullWidth
          testID="btn-verify"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: Theme.spacing.md,
    borderTopWidth: Theme.borderWidth.hairline,
    borderTopColor: Theme.colors.border.subtle,
    backgroundColor: Theme.colors.surface.default,
  },
  buttonWrapper: {
    flex: 1,
  },
  gap: {
    width: Theme.spacing.md,
  },
});