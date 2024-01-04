import React, {useEffect, useState} from 'react';
import {Button, Image, SafeAreaView, Text, View} from 'react-native';

function App() {
  const [data, setData] = useState([]);

  const getApplication = () => {};

  return (
    <SafeAreaView style={{flex: 1}}>
      <Button title="get Data" onPress={getApplication} />
    </SafeAreaView>
  );
}

export default App;
