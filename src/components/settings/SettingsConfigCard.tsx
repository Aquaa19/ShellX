import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { BorderedSurface, SectionHeader } from '../../atoms';

export interface SettingsConfigCardProps {
  title: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SettingsConfigCard: React.FC<SettingsConfigCardProps> = ({
  title,
  children,
  style,
}) => {
  return (
    <BorderedSurface level="default" borderRadius={Theme.borderRadius.lg} style={[styles.container, style]}>
      <SectionHeader title={title} />
      <View style={styles.content}>
        {children}
      </View>
    </BorderedSurface>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.lg,
    overflow: 'hidden',
  },
  content: {
    padding: Theme.spacing.md,
  },
});