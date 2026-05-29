import React from 'react';
import { ScrollView, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';

export interface FileSystemTreeProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const FileSystemTree: React.FC<FileSystemTreeProps> = ({
  children,
  style,
}) => {
  return (
    <ScrollView
      style={[styles.verticalScroll, style]}
      contentContainerStyle={styles.verticalContent}
      showsVerticalScrollIndicator={true}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.horizontalContent}
      >
        {children}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  verticalScroll: {
    flex: 1,
    backgroundColor: Theme.colors.background.floor,
    ...Theme.noShadow,
  },
  verticalContent: {
    flexGrow: 1,
    paddingVertical: Theme.spacing.sm,
  },
  horizontalContent: {
    flexGrow: 1,
    minWidth: '100%',
    paddingRight: Theme.spacing.xl, // Padding to ensure deeply nested items don't hit the right edge flush
  },
});