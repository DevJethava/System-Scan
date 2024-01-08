import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, Button, StyleSheet, TouchableOpacity} from 'react-native';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import TcpSocket from 'react-native-tcp-socket';
import Port from '../common/Port';
import NetInfo from '@react-native-community/netinfo';

const TestScreen = () => {
  const snapPoints = useMemo(() => ['30%', '40%', '50%'], []);
  const bottmoSheetRef = useRef(null);
  const [scan, setScan] = useState(false);
  const [open, setOpen] = useState([]);
  const [targetIPs, setTargetIps] = useState();
  const targetPorts = Port;
  useEffect(() => {
    checkPortsOnIPs();
  }, []);

  useEffect(() => {
    const unSubscribe = NetInfo.addEventListener(dat => {
      setTargetIps(dat.details.ipAddress);
    });

    return () => {
      unSubscribe && unSubscribe();
    };
  }, []);

  const checkPortsOnIPs = () => {
    setOpen([]);
    setScan(true);

    targetPorts.forEach(port => {
      checkPortStatus(targetIPs, port);
    });
  };

  const checkPortStatus = (ip, port) => {
    const client = TcpSocket.createConnection({host: ip, port: port}, () => {
      client.destroy();
    });

    client.on('connect', () => {
      setOpen(ols => [...ols, {ip_: ip, port_: port}]);
      if (port === targetPorts[targetPorts.length - 1]) {
        setScan(false);
        console.log('Done! Port Scan');
      }
      // console.error(`Port ${port} is open on ${ip}`);
      client.destroy(); // Close the socket connection
    });

    client.on('error', error => {
      if (port === targetPorts[targetPorts.length - 1]) {
        setScan(false);
        console.log('Done! Port Scan');
      }
      // console.log(`Port ${port} is closed on ${ip}`);
      client.destroy(); // Close the socket connection
    });
  };

  const renderItem = ({item, index}) => (
    <View
      style={{
        marginTop: 5,
        flexDirection: 'row',
        marginHorizontal: 15,
        justifyContent: 'space-between',
        paddingRight: 20,
      }}>
      <Text style={{fontSize: 15, color: '#34bbd3a6'}}>{index + 1}.</Text>
      <Text style={{fontSize: 15, color: '#d36318'}}>{targetIPs}</Text>
      <Text style={{fontSize: 15, color: '#d36318'}}>{item.port_}</Text>
    </View>
  );

  const handlerClosePress = () => {
    bottmoSheetRef.current?.close();
  };
  const handlerOpenPress = () => {
    bottmoSheetRef.current?.expand();
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Button title="Open" onPress={handlerOpenPress} />
      <Button title="Close" onPress={handlerClosePress} />
      <BottomSheet
        ref={bottmoSheetRef}
        enablePanDownToClose
        index={1}
        snapPoints={snapPoints}>
        {scan ? (
          <View style={{alignItems: 'center', marginBottom: 25}}>
            <Text
              style={{
                fontSize: 18,
                color: 'red',
              }}>
              Scanning....
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={checkPortsOnIPs}
            style={{
              marginHorizontal: 60,
              marginBottom: 30,
              padding: 10,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#74e470ad',
            }}>
            <Text style={{fontSize: 16, fontWeight: '600', color: '#bb9b1bff'}}>
              Re Scan
            </Text>
          </TouchableOpacity>
        )}
        {open.length == 0 && scan == false ? (
          <Text style={{color: 'green', fontSize: 20, padding: 30}}>
            No Open Ports Found ...
          </Text>
        ) : (
          <BottomSheetFlatList
            data={open}
            keyExtractor={item => item.port_}
            renderItem={renderItem}
          />
        )}
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    alignItems: 'center',
  },
});

export default TestScreen;
