import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { BorderedSurface } from '../../atoms';
import { AuthTerminalHeader } from './AuthTerminalHeader';

export interface AuthTerminalWindowProps {
  children: React.ReactNode;
  filename?: string;
  style?: StyleProp<ViewStyle>;
}

export const AuthTerminalWindow: React.FC<AuthTerminalWindowProps> = ({
  children,
  filename = 'auth_session.sh',
  style,
}) => {
  return (
    <BorderedSurface
      level="default"
      borderRadius={Theme.borderRadius.xl}
      style={[styles.container, style]}
    >
      <AuthTerminalHeader filename={filename} />
      <View style={styles.content}>
        {children}
      </View>
    </BorderedSurface>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  content: {
    padding: Theme.spacing.lg,
  },
});