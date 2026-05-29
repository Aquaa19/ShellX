import React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import { Theme } from '../../tokens';

export interface TrafficLightDotsProps {
  activeState?: 'none' | 'alert'; // Placeholder for possible active state modifications
  style?: StyleProp<ViewStyle>;
}

export const TrafficLightDots: React.FC<TrafficLightDotsProps> = ({
  activeState = 'none',
  style,
}) => {
  const dotSize = Theme.layout.trafficLightDotSize;
  
  const baseDotStyle = {
    width: dotSize,
    height: dotSize,
    borderRadius: Theme.borderRadius.full,
  };

  return (
    <View style={[styles.container, style]}>
      <View style={[baseDotStyle, { backgroundColor: Theme.colors.trafficLights.red }]} />
      <View style={[baseDotStyle, { backgroundColor: Theme.colors.trafficLights.yellow }]} />
      <View style={[baseDotStyle, { backgroundColor: Theme.colors.trafficLights.green }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Theme.layout.trafficLightDotSpacing,
    ...Theme.noShadow,
  },
});