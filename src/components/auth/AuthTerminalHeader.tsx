import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { TrafficLightDots, MonoText } from '../../atoms';

export interface AuthTerminalHeaderProps {
  filename: string;
  style?: StyleProp<ViewStyle>;
}

export const AuthTerminalHeader: React.FC<AuthTerminalHeaderProps> = ({
  filename,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftSlot}>
        <TrafficLightDots />
      </View>
      <View style={styles.titleSlot}>
        <MonoText
          size={Theme.fontSize.labelSM}
          color={Theme.colors.text.secondary}
        >
          {filename}
        </MonoText>
      </View>
      <View style={styles.rightSlot} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    backgroundColor: Theme.colors.surface.raised,
    borderBottomWidth: Theme.borderWidth.hairline,
    borderBottomColor: Theme.colors.border.subtle,
    paddingHorizontal: Theme.spacing.md,
    ...Theme.noShadow,
  },
  leftSlot: {
    flex: 1,
    alignItems: 'flex-start',
  },
  titleSlot: {
    flex: 2,
    alignItems: 'center',
  },
  rightSlot: {
    flex: 1,
  },
});