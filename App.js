import React from 'react';
import {SafeAreaView, Text} from 'react-native';
import Routs_old from './src_old/routes/Routs';
import Routes from './src/routes/Routes';

function App() {
  return (
    <SafeAreaView style={{flex: 1}}>
      {/* <Routs_old /> */}
      <Routes />
    </SafeAreaView>
  );
}

export default App;
