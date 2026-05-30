import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppBackground } from './components/shell';
import { RootNavigator } from './navigation';
import { AppContextProvider, NetworkBanner } from './context';

const App = () => {
  return (
    <SafeAreaProvider>
      <AppContextProvider>
        <AppBackground>
          <View style={styles.root}>
            <RootNavigator />
            <NetworkBanner />
          </View>
        </AppBackground>
      </AppContextProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;
