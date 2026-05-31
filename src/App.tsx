import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppBackground } from './components/shell';
import { RootNavigator } from './navigation';
import { AppContextProvider, AuthContextProvider, TerminalConnectionContextProvider, LessonsContextProvider, NetworkBanner } from './context';

const App = () => {
  return (
    <SafeAreaProvider>
      <AppContextProvider>
        <AuthContextProvider>
          <TerminalConnectionContextProvider>
            <LessonsContextProvider>
              <AppBackground>
                <View style={styles.root}>
                  <RootNavigator />
                  <NetworkBanner />
                </View>
              </AppBackground>
            </LessonsContextProvider>
          </TerminalConnectionContextProvider>
        </AuthContextProvider>
      </AppContextProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;
