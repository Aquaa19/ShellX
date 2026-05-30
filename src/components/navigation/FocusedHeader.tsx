import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { AppHeader } from '../shell/AppHeader';
import { IconButton, MaterialIcon, HeadlineText, MonoText } from '../../atoms';

export interface FocusedHeaderProps {
  title: string;
  onBackPress: () => void;
  rightSlot?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const FocusedHeader: React.FC<FocusedHeaderProps> = ({
  title,
  onBackPress,
  rightSlot,
  style,
}) => {
  const BackIcon = (
    <MaterialIcon 
      name="arrow-back" 
      size={24} 
      color={Theme.colors.text.primary} 
    />
  );

  return (
    <AppHeader
      title=""
      style={style}
      leftSlot={
        <View style={styles.leftContainer}>
          <IconButton
            icon={BackIcon}
            onPress={onBackPress}
            variant="ghost"
          />
          {title.startsWith('ShellX_') ? (
            <MonoText
              size={Theme.fontSize.titleLG}
              weight="bold"
              color={Theme.colors.semantic.success}
              style={styles.title}
            >
              {title}
            </MonoText>
          ) : (
            <HeadlineText
              size={Theme.fontSize.titleLG}
              weight="semiBold"
              color={Theme.colors.text.primary}
              style={styles.title}
            >
              {title}
            </HeadlineText>
          )}
        </View>
      }
      rightSlot={rightSlot}
    />
  );
};

const styles = StyleSheet.create({
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: Theme.spacing.sm,
  },
});