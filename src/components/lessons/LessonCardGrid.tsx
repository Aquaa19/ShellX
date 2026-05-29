import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';

export interface LessonCardGridProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const LessonCardGrid: React.FC<LessonCardGridProps> = ({
  children,
  style,
}) => {
  return (
    <View style={[styles.grid, style]}>
      {React.Children.map(children, (child) => (
        <View style={styles.gridItem}>
          {child}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -(Theme.spacing.sm / 2),
  },
  gridItem: {
    width: '50%',
    padding: Theme.spacing.sm / 2,
  },
});