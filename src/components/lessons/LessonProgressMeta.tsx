import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { BodyText, MaterialIcon } from '../../atoms';

export interface LessonProgressMetaProps {
  commandsCount: number;
  estimatedMinutes: number;
  style?: StyleProp<ViewStyle>;
}

export const LessonProgressMeta: React.FC<LessonProgressMetaProps> = ({
  commandsCount,
  estimatedMinutes,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.metaItem}>
        <MaterialIcon name="terminal" size={16} color={Theme.colors.text.secondary} />
        <BodyText size={Theme.fontSize.labelSM} color={Theme.colors.text.secondary} style={styles.metaText}>
          {commandsCount} cmds
        </BodyText>
      </View>
      <View style={styles.metaItem}>
        <MaterialIcon name="schedule" size={16} color={Theme.colors.text.secondary} />
        <BodyText size={Theme.fontSize.labelSM} color={Theme.colors.text.secondary} style={styles.metaText}>
          {estimatedMinutes}m
        </BodyText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
    marginTop: Theme.spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: Theme.spacing.xxs,
  },
});