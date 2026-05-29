import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { BodyText } from '../../atoms';
import { ShellXBrandMark } from '../shell/ShellXBrandMark';

export interface AuthBrandPanelProps {
  tagline?: string;
  style?: StyleProp<ViewStyle>;
}

export const AuthBrandPanel: React.FC<AuthBrandPanelProps> = ({
  tagline = 'Initialize your workspace.',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ShellXBrandMark size={48} />
      <BodyText
        size={Theme.fontSize.bodyMD}
        color={Theme.colors.text.secondary}
        style={styles.tagline}
      >
        {tagline}
      </BodyText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  tagline: {
    marginTop: Theme.spacing.md,
    textAlign: 'center',
  },
});