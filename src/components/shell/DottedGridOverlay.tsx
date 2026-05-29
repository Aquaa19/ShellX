import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Theme } from '../../tokens';

export const DottedGridOverlay: React.FC = () => {
  // A performant, dependency-free repeated dot grid using a tiny base64 encoded image.
  const dotPatternURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAIklEQVQ4T2NkYGD4z8DAwMgAA0zEAJoaRigwGjBqwKgBBAAAl1wFAYk5m0sAAAAASUVORK5CYII=';

  return (
    <View pointerEvents="none" style={styles.container}>
      <ImageBackground
        source={{ uri: dotPatternURI }}
        resizeMode="repeat"
        style={StyleSheet.absoluteFill}
        accessible={false}
        importantForAccessibility="no-hide-descendants"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: Theme.zIndex.floor,
    opacity: 0.5,
  },
});
