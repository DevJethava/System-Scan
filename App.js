/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  SafeAreaView,
  DeviceEventEmitter,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  NativeModules,
} from 'react-native';
const {NetworkDiscoveryModule} = NativeModules;

function App() {
  const [isShowIndicator, setIsShowIndicator] = useState(false);
  const [hostList, setHostList] = useState([]);
  const [sortData, setSortData] = useState([]);

  const onNetworkDiscovery2 = async () => {
    try {
      setIsShowIndicator(true);
      setHostList([]);
      await NetworkDiscoveryModule.getNetworkDiscovery2();
    } catch (e) {
      console.error(e, 'start');
    }
  };
  const onNetworkProgressCall = async event => {
    try {
      let res = JSON.parse(event);
      if (res.isFinished) {
        setIsShowIndicator(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // const eventEmitter = new DeviceEventEmitter();
    const onHostBeanUpdate = DeviceEventEmitter.addListener(
      'onHostBeanUpdate',
      onHostBeanUpdateCall,
    );
    const onProgressUpdate = DeviceEventEmitter.addListener(
      'onProgressUpdate',
      onProgressUpdateCall,
    );
    const onCancel = DeviceEventEmitter.addListener('onCancel', onCancelCall);
    const onExecuteComplete = DeviceEventEmitter.addListener(
      'onExecuteComplete',
      onExecuteCompleteCall,
    );
    const onNetworkHostUpdate = DeviceEventEmitter.addListener(
      'onNetworkHostUpdate',
      onNetworkHostUpdateCall,
    );
    const onNetworkProgress = DeviceEventEmitter.addListener(
      'onNetworkProgress',
      onNetworkProgressCall,
    );

    return () => {
      onHostBeanUpdate.remove();
      onProgressUpdate.remove();
      onCancel.remove();
      onExecuteComplete.remove();
      onNetworkHostUpdate.remove();
      onNetworkProgress.remove();
    };
  }, []);

  const onHostBeanUpdateCall = event => {
    console.log('onHostBeanUpdateCall => ', event);
    let res = JSON.parse(event);
    setHostList(preList => [...preList, res]);
  };

  const onProgressUpdateCall = event => {
    console.log('onProgressUpdateCall => ', event);
    setProgress(event.progress);
  };

  const onCancelCall = event => {
    setIsShowIndicator(false);
    console.log('onCancelCall => ', event);
  };

  const onExecuteCompleteCall = event => {
    let res = JSON.parse(event);
    setHostList(res.hosts);
    console.log('onExecuteCompleteCall => ', res.hosts);
    setIsShowIndicator(false);
    console.log(hostList);
  };

  const onNetworkHostUpdateCall = event => {
    let res = JSON.parse(event);
    if (!hostList.includes(event)) {
      setHostList(preList => [...preList, res]);
    }
  };

  useEffect(() => {
    setSortData(hostList.sort(compareIPAddresses));
  }, [hostList]);

  function compareIPAddresses(a, b) {
    const numA = Number(
      a.ip
        .split('.')
        .map((num, idx) => num * Math.pow(2, (3 - idx) * 8))
        .reduce((a, v) => ((a += v), a), 0),
    );
    const numB = Number(
      b.ip
        .split('.')
        .map((num, idx) => num * Math.pow(2, (3 - idx) * 8))
        .reduce((a, v) => ((a += v), a), 0),
    );
    return numA - numB;
  }

  const Item = ({item, pos}) => (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => console.log(pos, item)}>
      <View
        style={{
          flexDirection: 'column',
          padding: 8,
          borderColor: '#000000',
          borderWidth: 1,
          margin: 8,
          borderRadius: 8,
        }}>
        <Text>Host Name: {item.hostname}</Text>
        <Text>IP Address: {item.ip}</Text>
        <Text>MAC Address: {item.mac}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <Button
        title="Network Discovery 2"
        color="#00F100"
        onPress={onNetworkDiscovery2}
      />

      <View
        style={{
          marginTop: 32,
          margin: 16,
          justifyContent: 'space-evenly',
          flexDirection: 'row',
        }}></View>
      {isShowIndicator && <ActivityIndicator size="large" />}

      <View>
        <FlatList
          data={sortData}
          renderItem={({item, index}) => <Item item={item} pos={index} />}
          keyExtractor={(item, pos) => pos.toString()}
        />
      </View>
    </SafeAreaView>
  );
}

export default App;
