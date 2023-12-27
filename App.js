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
  Alert,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
const {NetworkDiscoveryModule} = NativeModules;

function App() {
  const [networkData, setNetWorkData] = useState('');
  const [isShowIndicator, setIsShowIndicator] = useState(false);
  const [hostList, setHostList] = useState([]);
  const [sortData, setSortData] = useState([]);
  const [deviceWifiData, setDevicewifiData] = useState({
    hostname: null,
    ip: null,
    mac: null,
  });

  useEffect(() => {
    const unSubscribe = NetInfo.addEventListener(dat => {
      setNetWorkData(dat);
      setDevicewifiData({
        hostname: dat.details.ipAddress,
        ip: dat.details.ipAddress,
        mac: dat.details.bssid,
      });
    });

    return () => {
      unSubscribe && unSubscribe();
    };
  }, []);

  useEffect(() => {
    setSortData(hostList.sort(compareIPAddresses));
  }, [hostList]);

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

  const onNetworkDiscovery2 = async () => {
    if (networkData?.type == 'wifi') {
      try {
        setIsShowIndicator(true);
        setHostList([]);
        setHostList(preList => [...preList, deviceWifiData]);
        await NetworkDiscoveryModule.getNetworkDiscovery2();
      } catch (e) {
        console.error(e, 'start');
      }
    } else {
      Alert.alert('Please connect to wifi');
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

      {isShowIndicator ? (
        <ActivityIndicator
          size="large"
          style={{
            marginTop: 30,
          }}
        />
      ) : (
        <View style={{flex: 1, marginTop: 10}}>
          <FlatList
            data={sortData}
            renderItem={({item, index}) => <Item item={item} pos={index} />}
            keyExtractor={(item, pos) => pos.toString()}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

export default App;
