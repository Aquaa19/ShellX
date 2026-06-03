import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { HeadlineText } from '../../atoms';

export interface AppHeaderProps {
  title?: string;
  centerSlot?: React.ReactNode;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  centerSlot,
  leftSlot,
  rightSlot,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Absolute center title slot */}
      <View style={styles.centerContainer} pointerEvents="none">
        {centerSlot ? centerSlot : (
          title ? (
            <HeadlineText
              size={Theme.fontSize.titleMD}
              weight="semiBold"
              color={Theme.colors.text.primary}
            >
              {title}
            </HeadlineText>
          ) : null
        )}
      </View>

      {/* Left Slot container */}
      <View style={styles.leftContainer}>
        {leftSlot}
      </View>

      {/* Right Slot container */}
      <View style={styles.rightContainer}>
        {rightSlot}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Theme.layout.topAppBarHeight + Theme.layout.statusBarHeight,
    paddingTop: Theme.layout.statusBarHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.background.floor,
    borderBottomWidth: Theme.borderWidth.hairline,
    borderBottomColor: Theme.colors.border.subtle,
    ...Theme.noShadow,
  },
  leftContainer: {
    minWidth: Theme.layout.minTouchTarget,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: Theme.spacing.md,
    zIndex: 2,
  },
  rightContainer: {
    minWidth: Theme.layout.minTouchTarget,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: Theme.spacing.md,
    zIndex: 2,
  },
  centerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: Theme.layout.statusBarHeight,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});