import React from 'react';
import { AppBackground } from './components/shell';
import { RootNavigator } from './navigation';

const App = () => {
  return (
    <AppBackground>
      <RootNavigator />
    </AppBackground>
  );
};

export default App;