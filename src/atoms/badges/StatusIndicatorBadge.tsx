import React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import { Theme } from '../../tokens';
import { StatusDot, DotVariant } from './StatusDot';
import { LabelCapsText } from '../text/LabelCapsText';

export interface StatusIndicatorBadgeProps {
  label: string;
  variant: DotVariant;
  style?: StyleProp<ViewStyle>;
}

export const StatusIndicatorBadge: React.FC<StatusIndicatorBadgeProps> = ({
  label,
  variant,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <StatusDot variant={variant} />
      <LabelCapsText color={Theme.colors.text.primary}>
        {label}
      </LabelCapsText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    backgroundColor: Theme.colors.surface.raised,
    borderWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
    borderRadius: Theme.borderRadius.default,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xxs,
    ...Theme.noShadow,
  },
});