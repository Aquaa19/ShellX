import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { MonoText } from '../../atoms';
import type { ConnectionState } from '../../atoms'; // Assuming exported from atoms/badges

export interface TopMetricsBarProps {
  filepath: string;
  connectionState: ConnectionState;
  style?: StyleProp<ViewStyle>;
}

export const TopMetricsBar: React.FC<TopMetricsBarProps> = ({
  filepath,
  connectionState: _connectionState,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <MonoText size={Theme.fontSize.labelSM} color={Theme.colors.text.secondary}>
        {filepath}
      </MonoText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Theme.layout.topMetricsBarHeight, // 40
    backgroundColor: Theme.colors.background.elevated,
    paddingHorizontal: Theme.spacing.md,
    borderBottomWidth: Theme.borderWidth.hairline,
    borderBottomColor: Theme.colors.border.subtle,
    ...Theme.noShadow,
  },
});