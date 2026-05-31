import React from 'react';
import { ScrollView, StyleSheet, StyleProp, ViewStyle, View } from 'react-native';
import { Theme } from '../../tokens';
import { TerminalKeyButton } from '../../atoms';
import type { KeyDef } from './DeveloperKeyboardBar';

export interface DeveloperKeyboardRowProps {
  keys: KeyDef[];
  onKeyPress: (sequence: string) => void;
  style?: StyleProp<ViewStyle>;
}

export const DeveloperKeyboardRow: React.FC<DeveloperKeyboardRowProps> = ({
  keys,
  onKeyPress,
  style,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      style={[styles.container, style]}
      contentContainerStyle={styles.contentContainer}
    >
      {keys.map((key) => (
        <View key={key.label} style={styles.keyWrapper}>
          <TerminalKeyButton
            label={key.label}
            special={key.special}
            onPress={() => onKeyPress(key.sequence)}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.background.elevated,
    flexGrow: 0,
    ...Theme.noShadow,
  },
  contentContainer: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    alignItems: 'center',
  },
  keyWrapper: {
    marginRight: Theme.spacing.xs,
  },
});