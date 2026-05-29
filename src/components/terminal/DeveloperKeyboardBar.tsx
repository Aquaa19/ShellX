import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { KeyboardDivider } from './KeyboardDivider';
import { DeveloperKeyboardRow } from './DeveloperKeyboardRow';

export interface DeveloperKeyboardBarProps {
  onKeyPress: (key: string) => void;
  style?: StyleProp<ViewStyle>;
}

export const DeveloperKeyboardBar: React.FC<DeveloperKeyboardBarProps> = ({
  onKeyPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <KeyboardDivider />
      <DeveloperKeyboardRow onKeyPress={onKeyPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Theme.layout.developerKeyboardBarHeight, // 56
    backgroundColor: Theme.colors.background.elevated,
    ...Theme.noShadow,
  },
});