import React from 'react';
import { View, Image, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { HeadlineText, BodyText, MaterialIcon } from '../../atoms';

export interface ProfileAvatarBlockProps {
  name: string;
  email: string;
  avatarUrl?: string;
  style?: StyleProp<ViewStyle>;
}

export const ProfileAvatarBlock: React.FC<ProfileAvatarBlockProps> = ({
  name,
  email,
  avatarUrl,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatarImage} accessible={true} accessibilityLabel={`${name}'s Avatar`} />
        ) : (
          <MaterialIcon name="person" size={40} color={Theme.colors.text.secondary} />
        )}
      </View>
      <HeadlineText size={Theme.fontSize.titleMD} weight="bold" color={Theme.colors.text.primary} style={styles.name}>
        {name}
      </HeadlineText>
      <BodyText size={Theme.fontSize.bodySM} color={Theme.colors.text.secondary}>
        {email}
      </BodyText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.lg,
  },
  avatarContainer: {
    width: Theme.layout.profileAvatarSizeLG, // 72dp
    height: Theme.layout.profileAvatarSizeLG,
    borderRadius: Theme.borderRadius.full,
    borderWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
    backgroundColor: Theme.colors.surface.raised,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.md,
    overflow: 'hidden',
    ...Theme.noShadow,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    marginBottom: Theme.spacing.xxs,
  },
});