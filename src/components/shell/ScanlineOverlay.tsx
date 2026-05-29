import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Theme } from '../../tokens';

export const ScanlineOverlay: React.FC = () => {
  // Generate an array to render multiple 1px lines across the screen.
  const lines = Array.from({ length: 150 });

  return (
    <View 
      style={styles.container} 
      pointerEvents="none"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      {lines.map((_, i) => (
        <View 
          key={i} 
          style={styles.scanline} 
          accessible={false}
          importantForAccessibility="no-hide-descendants"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: Theme.zIndex.overlay,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  scanline: {
    width: '100%',
    height: 1,
    backgroundColor: Theme.colors.overlay.scanline,
  },
});