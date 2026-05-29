import React from 'react';
import { ScrollView, StyleSheet, StyleProp, ViewStyle, View } from 'react-native';
import { Theme } from '../../tokens';
import { TerminalKeyButton } from '../../atoms';

export interface DeveloperKeyboardRowProps {
  onKeyPress: (key: string) => void;
  style?: StyleProp<ViewStyle>;
}

const KEYS = ['ESC', 'TAB', 'CTRL', 'ALT', '|', '/', '\\', '-', '~', 'UP', 'DOWN', 'LEFT', 'RIGHT'];

export const DeveloperKeyboardRow: React.FC<DeveloperKeyboardRowProps> = ({
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
      {KEYS.map((key) => {
        const isSpecial = ['ESC', 'TAB', 'CTRL', 'ALT', 'UP', 'DOWN', 'LEFT', 'RIGHT'].includes(key);
        return (
          <View key={key} style={styles.keyWrapper}>
            <TerminalKeyButton
              label={key}
              special={isSpecial}
              onPress={() => onKeyPress(key)}
            />
          </View>
        );
      })}
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