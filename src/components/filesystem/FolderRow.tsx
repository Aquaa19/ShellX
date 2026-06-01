import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Animated, Easing } from 'react-native';
import { Theme } from '../../tokens';
import { MonoText, FolderIcon, MaterialIcon } from '../../atoms';
import { FileTreeRow } from './FileTreeRow';

export interface FolderRowProps {
  name: string;
  depth: number;
  isOpen: boolean;
  onPress: () => void;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const FolderRow: React.FC<FolderRowProps> = ({
  name,
  depth,
  isOpen,
  onPress,
  isLoading = false,
  style,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.setValue(0);
    }
  }, [isLoading, rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <FileTreeRow
      depth={depth}
      onPress={onPress}
      accessibilityLabel={`Folder: ${name}, ${isOpen ? 'Expanded' : 'Collapsed'}`}
      style={style}
    >
      <View style={styles.chevronWrapper}>
        {isLoading ? (
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <MaterialIcon name="refresh" size={16} color={Theme.colors.text.secondary} />
          </Animated.View>
        ) : (
          <MaterialIcon
            name={isOpen ? 'expand-more' : 'chevron-right'}
            size={16}
            color={Theme.colors.text.secondary}
          />
        )}
      </View>
      <View style={styles.iconWrapper} accessible={false} importantForAccessibility="no-hide-descendants">
        <FolderIcon open={isOpen} size="md" />
      </View>
      <MonoText size={Theme.fontSize.bodySM} color={Theme.colors.text.primary}>
        {name}
      </MonoText>
    </FileTreeRow>
  );
};

const styles = StyleSheet.create({
  chevronWrapper: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.xs,
  },
  iconWrapper: {
    marginRight: Theme.spacing.sm,
  },
});