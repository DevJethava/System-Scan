import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Button, SafeAreaView, Text, View} from 'react-native';

function App() {
  const [networkData, setNetWorkData] = useState('');

  useEffect(() => {
    SpeedTest();
  }, []);

  const SpeedTest = async () => {
    axios
      .get(
        // 'https://www.showmyip.com/ip-whois-lookup/?fields=66846719&ip=117.217.127.105/json',
        'https://ipinfo.io/',
        // 'https://ip.guide/',
        // 'https://api.bigdatacloud.net/data/reverse-geocode-client',
        // 'http://ipwho.is/?output=json',
      )
      .then(data => {
        console.log(JSON.stringify(data.data, '', 2));
        setNetWorkData(data.data);
      })
      .catch(error => {
        console.log(error, 'eror');
        setTimeout(() => {
          SpeedTest();
        }, 2000);
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {networkData != '' ? (
        <View>
          <Text>Local Ip : {networkData.ip}</Text>
          <Text>{networkData.org}</Text>
          <Text>
            {networkData.city},{networkData.region},{networkData.country_name}
          </Text>
        </View>
      ) : (
        <View>
          <Text>Not Yet Data get</Text>
        </View>
      )}
      <Button title="get Data" onPress={SpeedTest} />
    </SafeAreaView>
  );
}

export default App;
