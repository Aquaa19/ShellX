import React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import { Theme } from '../../tokens';
import { LabelCapsText } from '../text/LabelCapsText';

export type LessonState = 'complete' | 'inProgress' | 'locked';

export interface LessonStateBadgeProps {
  state: LessonState;
  style?: StyleProp<ViewStyle>;
}

export const LessonStateBadge: React.FC<LessonStateBadgeProps> = ({
  state,
  style,
}) => {
  const getStateColors = () => {
    switch (state) {
      case 'complete':
        return {
          bg: Theme.colors.semantic.successDim,
          text: Theme.colors.semantic.success,
          label: 'COMPLETE',
        };
      case 'inProgress':
        return {
          bg: Theme.colors.primary.muted,
          text: Theme.colors.primary.default,
          label: 'IN PROGRESS',
        };
      case 'locked':
      default:
        return {
          bg: Theme.colors.surface.raised,
          text: Theme.colors.text.secondary,
          label: 'LOCKED',
        };
    }
  };

  const config = getStateColors();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: config.bg },
        style,
      ]}
    >
      <LabelCapsText color={config.text}>
        {config.label}
      </LabelCapsText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Theme.layout.connectionBadgeHeight,
    borderRadius: Theme.borderRadius.sm,
    paddingHorizontal: Theme.spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.noShadow,
  },
});