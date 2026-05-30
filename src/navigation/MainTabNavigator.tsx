import React from 'react';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { TerminalScreen, LessonsScreen, FileSystemScreen, SettingsScreen } from '../screens';
import { BottomTabBar, BottomTabItem } from '../components';
import { MaterialIcon } from '../atoms';
import { Theme } from '../tokens';

export type MainTabParamList = {
  Terminal: undefined;
  Lessons: undefined;
  Files: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  return (
    <BottomTabBar>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        
        let iconName = 'terminal';
        let label = route.name;

        switch (route.name) {
          case 'Terminal': iconName = 'terminal'; break;
          case 'Lessons': iconName = 'school'; break;
          case 'Files': iconName = 'folder'; break;
          case 'Settings': iconName = 'settings'; break;
        }

        const iconColor = isFocused ? Theme.colors.primary.default : Theme.colors.text.tertiary;

        return (
          <BottomTabItem
            key={route.key}
            active={isFocused}
            label={label}
            icon={<MaterialIcon name={iconName} size={24} color={iconColor} />}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
          />
        );
      })}
    </BottomTabBar>
  );
};

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={CustomTabBar}
    >
      <Tab.Screen name="Terminal" component={TerminalScreen} />
      <Tab.Screen name="Lessons" component={LessonsScreen} />
      <Tab.Screen name="Files" component={FileSystemScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};