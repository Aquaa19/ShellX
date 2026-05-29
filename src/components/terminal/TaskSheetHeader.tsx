import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { HeadlineText, IconButton, MaterialIcon } from '../../atoms';

export interface TaskSheetHeaderProps {
  title: string;
  onClose: () => void;
  style?: StyleProp<ViewStyle>;
}

export const TaskSheetHeader: React.FC<TaskSheetHeaderProps> = ({
  title,
  onClose,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.dragHandle} accessible={false} />
      <View style={styles.content}>
        <HeadlineText size={Theme.fontSize.titleSM} weight="bold" color={Theme.colors.text.primary}>
          {title}
        </HeadlineText>
        <IconButton
          icon={<MaterialIcon name="close" size={24} color={Theme.colors.text.secondary} />}
          onPress={onClose}
          variant="ghost"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.sm,
    borderBottomWidth: Theme.borderWidth.hairline,
    borderBottomColor: Theme.colors.border.subtle,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: Theme.colors.border.strong,
    borderRadius: Theme.borderRadius.full,
    alignSelf: 'center',
    marginBottom: Theme.spacing.md,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});