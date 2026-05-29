import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { BodyText, ProgressTrack } from '../../atoms';

export interface LessonContextHeaderProps {
  title: string;
  progress: number;
  style?: StyleProp<ViewStyle>;
}

export const LessonContextHeader: React.FC<LessonContextHeaderProps> = ({
  title,
  progress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <BodyText size={Theme.fontSize.bodySM} weight="semiBold" color={Theme.colors.text.primary} style={styles.title}>
        {title}
      </BodyText>
      <ProgressTrack progress={progress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.background.elevated,
    borderBottomWidth: Theme.borderWidth.hairline,
    borderBottomColor: Theme.colors.border.subtle,
    ...Theme.noShadow,
  },
  title: {
    marginBottom: Theme.spacing.sm,
  },
});