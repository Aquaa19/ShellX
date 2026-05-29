import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen, AuthScreen } from '../screens';
import { MainTabNavigator } from './MainTabNavigator';
import { Theme } from '../tokens';

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer
      theme={{
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: Theme.colors.primary.default,
          background: Theme.colors.background.floor,
          card: Theme.colors.background.elevated,
          text: Theme.colors.text.primary,
          border: Theme.colors.border.subtle,
          notification: Theme.colors.semantic.error,
        },
      }}
    >
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ animation: 'fade' }} 
        />
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen} 
          options={{ animation: 'fade' }} 
        />
        <Stack.Screen 
          name="Main" 
          component={MainTabNavigator} 
          options={{ animation: 'slide_from_right' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};