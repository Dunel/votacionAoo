import React from 'react';
import {StatusBar} from 'react-native';
import Navigation from './src/navigator/Navigation';
import {AuthProvider} from './src/context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      {<StatusBar  />}
      <Navigation />
    </AuthProvider>
  );
};

export default App;