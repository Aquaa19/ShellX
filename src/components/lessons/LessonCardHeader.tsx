import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { HeadlineText } from '../../atoms';
import { LessonStatusIcon, LessonState } from './LessonStatusIcon';

export interface LessonCardHeaderProps {
  title: string;
  state: LessonState;
  style?: StyleProp<ViewStyle>;
}

export const LessonCardHeader: React.FC<LessonCardHeaderProps> = ({
  title,
  state,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <HeadlineText 
        size={Theme.fontSize.titleSM} 
        weight="semiBold" 
        color={state === 'locked' ? Theme.colors.text.secondary : Theme.colors.text.primary}
        style={styles.title}
      >
        {title}
      </HeadlineText>
      <LessonStatusIcon state={state} size={20} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.xs,
  },
  title: {
    flex: 1,
    paddingRight: Theme.spacing.sm,
  },
});