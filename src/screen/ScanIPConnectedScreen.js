import React, {useEffect, useState} from 'react';
import {
  DeviceEventEmitter,
  FlatList,
  NativeModules,
  Text,
  TouchableOpacity,
  View,
  Alert,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';
const {NetworkDiscoveryModule} = NativeModules;

export const ScanIPConnected = () => {
  const navigation = useNavigation();
  const [scan, setScan] = useState(false);
  const [networkData, setNetWorkData] = useState('');
  const [hostList, setHostList] = useState([]);
  const [sortData, setSortData] = useState([]);
  const [deviceWifiData, setDevicewifiData] = useState({
    hostname: null,
    ip: null,
    mac: null,
  });

  useEffect(() => {
    Peermisson1();
    Peermisson2();
  }, []);

  const Peermisson1 = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Read Storage Permission',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Read Storage');
      } else {
        console.log('Read Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const Peermisson2 = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Write Storage Permission',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use Write Storage ');
      } else {
        console.log('Write Storage permission denied ');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    const unSubscribe = NetInfo.addEventListener(dat => {
      setNetWorkData(dat);
      setDevicewifiData({
        ...deviceWifiData,
        hostname:
          deviceWifiData.hostname == null
            ? dat.details.ipAddress
            : deviceWifiData.hostname,
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
    setScan(false);
    console.log('onCancelCall => ', event);
  };

  const onExecuteCompleteCall = event => {
    let res = JSON.parse(event);
    setHostList(res.hosts);
    console.log('onExecuteCompleteCall => ', res.hosts);
    setScan(false);
    console.log(hostList);
  };

  const onNetworkHostUpdateCall = event => {
    let res = JSON.parse(event);
    if (!hostList.includes(event)) {
      setHostList(preList => [...preList, res]);
    }
  };

  const onNetworkDiscovery2 = async () => {
    await DeviceInfo.getProduct().then(data => {
      setDevicewifiData({...deviceWifiData, hostname: data});
    });
    if (networkData?.type == 'wifi') {
      try {
        setScan(true);
        setHostList([]);
        setHostList(preList => [...preList, deviceWifiData]);
        await NetworkDiscoveryModule.getNetworkDiscovery2();
      } catch (e) {
        console.error(e, 'start');
      }
    } else {
      Alert.alert('You have not connected to wifi');
    }
  };

  const onNetworkProgressCall = async event => {
    try {
      let res = JSON.parse(event);
      if (res.isFinished) {
        setScan(false);
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
      onPress={() =>
        // navigation.navigate('IP_Port_Scan', {
        //   IP: [item.ip],
        // })
        console.log('presa')
      }>
      <View style={styles.container}>
        <Text style={styles.text}>
          <Text style={styles.mianHeader}>Host Name {'      '}: </Text>
          {'   '}
          {item.hostname}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.mianHeader}>IP Address {'       '}: </Text>
          {'   '}
          {item.ip}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.mianHeader}>MAC Address {'  '}: </Text>
          {'   '}
          {item.mac}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginVertical: 10,
        }}>
        <TouchableOpacity
          onPress={onNetworkDiscovery2}
          activeOpacity={0.5}
          style={{
            padding: 10,
            width: '40%',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: scan ? '#d3d3d3d8' : '#ffffff',
          }}
          disabled={scan}>
          <Text style={{fontSize: 16, fontWeight: '600', color: '#b1900e'}}>
            {hostList == '' ? 'Scan' : 'Re Scan'}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            // marginHorizontal: 60,
            width: '40%',
            padding: 10,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#d3d3d362',
          }}>
          <Text style={{fontSize: 16, fontWeight: '600', color: '#b1900e'}}>
            Total IP : {hostList.length}
          </Text>
        </View>
      </View>
      <View style={{flex: 1}}>
        {hostList == '' && scan == false ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}>
            <Text
              style={{
                color: '#05b5be',
                fontSize: 20,
                padding: 30,
                fontSize: 28,
              }}>
              No Data Found ...
            </Text>
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={sortData}
            renderItem={({item, index}) => <Item item={item} pos={index} />}
            keyExtractor={(item, pos) => pos.toString()}
          />
        )}
      </View>
      {scan ? (
        <View style={{alignItems: 'center', marginBottom: 10}}>
          <Text
            style={{
              fontSize: 20,
              color: 'red',
            }}>
            Scanning....
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 3,
    paddingLeft: 20,
    marginHorizontal: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 4,
  },
  mianHeader: {
    color: '#000000',
    fontSize: 15,
    paddingVertical: 10,
    fontWeight: '400',
  },
  text: {fontSize: 14, color: '#05b5be', marginTop: 2},
});
