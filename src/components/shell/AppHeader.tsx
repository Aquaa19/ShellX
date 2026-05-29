import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { HeadlineText } from '../../atoms';

export interface AppHeaderProps {
  title: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  leftSlot,
  rightSlot,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.sideSlot}>{leftSlot}</View>
      <View style={styles.centerSlot}>
        <HeadlineText
          size={Theme.fontSize.titleMD}
          weight="semiBold"
          color={Theme.colors.text.primary}
        >
          {title}
        </HeadlineText>
      </View>
      <View style={[styles.sideSlot, styles.rightSlot]}>{rightSlot}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Theme.layout.topAppBarHeight,
    paddingTop: Theme.layout.statusBarHeight,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.floor,
    borderBottomWidth: Theme.borderWidth.hairline,
    borderBottomColor: Theme.colors.border.subtle,
    ...Theme.noShadow,
  },
  sideSlot: {
    width: Theme.layout.minTouchTarget,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSlot: {
    alignItems: 'flex-end',
    paddingRight: Theme.spacing.sm,
  },
  centerSlot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});