import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { HeadlineText, BodyText, MaterialIcon } from '../../atoms';

export interface SideNavProfileHeaderProps {
  name: string;
  email: string;
  style?: StyleProp<ViewStyle>;
}

export const SideNavProfileHeader: React.FC<SideNavProfileHeaderProps> = ({
  name,
  email,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.avatar}>
        <MaterialIcon name="person" size={24} color={Theme.colors.text.secondary} />
      </View>
      <View style={styles.textContainer}>
        <HeadlineText size={Theme.fontSize.titleSM} weight="semiBold" color={Theme.colors.text.primary}>
          {name}
        </HeadlineText>
        <BodyText size={Theme.fontSize.labelSM} color={Theme.colors.text.secondary}>
          {email}
        </BodyText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    borderBottomWidth: Theme.borderWidth.hairline,
    borderBottomColor: Theme.colors.border.subtle,
  },
  avatar: {
    width: Theme.layout.profileAvatarSize,
    height: Theme.layout.profileAvatarSize,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.surface.raised,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
    ...Theme.noShadow,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});