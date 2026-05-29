import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { LabelCapsText } from '../text/LabelCapsText';

export interface SectionHeaderProps {
  title: string;
  rightSlot?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  rightSlot,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <LabelCapsText color={Theme.colors.text.primary}>
        {title}
      </LabelCapsText>
      {rightSlot && <View style={styles.rightSlot}>{rightSlot}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: Theme.borderWidth.hairline,
    borderBottomColor: Theme.colors.border.subtle,
    ...Theme.noShadow,
  },
  rightSlot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});