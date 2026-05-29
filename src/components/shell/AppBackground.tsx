import React from 'react';
import { StatusBar, StyleProp, ViewStyle } from 'react-native';
import { TrueDarkCanvas } from './TrueDarkCanvas';

export interface AppBackgroundProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const AppBackground: React.FC<AppBackgroundProps> = ({
  children,
  style,
}) => {
  return (
    <TrueDarkCanvas style={style}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#000000"
        translucent={true}
      />
      {children}
    </TrueDarkCanvas>
  );
};