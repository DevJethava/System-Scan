import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import NetWorkSpeed from '../common/NetWorkSpeed';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from '../routes/ContextProvider';
import {useNavigation} from '@react-navigation/native';

export default function DashBoardScreen() {
  const [DeviceName, setDeviceName] = useState(null);
  const [networkData, setNetWorkData] = useState('');
  const {currentUser, setCurrentUser} = useContext(UserContext);
  const naviagtion = useNavigation();

  useEffect(() => {
    CollectData();
  }, []);

  useEffect(() => {
    const unSubscribe = NetInfo.addEventListener(dat => {
      setNetWorkData(dat);
    });

    return () => {
      unSubscribe && unSubscribe();
    };
  }, []);

  const CollectData = async () => {
    await DeviceInfo.getDeviceName().then(data => setDeviceName(data));
    setCurrentUser(await AsyncStorage.getItem('onlineDevices'));
  };

  return (
    <ScrollView style={{flexGrow: 1}}>
      <View style={{marginLeft: 20, margin: 15, marginLeft: 20}}>
        <Text style={Styles.text}>
          Hey{' '}
          <Text style={{fontSize: 24, fontWeight: '600', color: '#2e54a5cd'}}>
            {DeviceName}
          </Text>
        </Text>
      </View>
      <NetWorkSpeed />
      {networkData.type == 'wifi' ? (
        <View>
          <View
            style={{
              margin: 10,
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: 25,
              elevation: 4,
            }}>
            <Text style={{fontSize: 24, fontWeight: 600}}>
              {networkData.details.bssid}
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: '#000000aa',
                fontWeight: 600,
                marginTop: 10,
              }}>
              &#x1f6dc; current
            </Text>
          </View>
          <View
            style={{
              margin: 10,
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: 25,
              elevation: 4,
            }}>
            <Text style={{fontSize: 20, fontWeight: '600', color: '#2e54a5cc'}}>
              {currentUser || 0} Online Devices
            </Text>
            <Text style={{fontSize: 20, marginTop: 10, marginLeft: 5}}>
              IP :- {networkData.details.ipAddress}
            </Text>
          </View>
          <View style={{margin: 20, marginTop: '10%'}}>
            <TouchableOpacity
              style={{
                backgroundColor: '#2e54a5cc',
                borderRadius: 12,
                padding: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => naviagtion.navigate('ScanIP')}>
              <Text style={{fontSize: 16, color: 'white', fontWeight: '600'}}>
                See who's connected!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View
          style={{
            margin: 10,
            backgroundColor: '#ffffff',
            borderRadius: 12,
            padding: 10,
            elevation: 4,
            height: '40%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 24,
              color: '#000000aa',
              marginLeft: 15,
              fontWeight: 600,
            }}>
            Not connected to wifi
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: '#000585aa',
              marginLeft: 15,
              marginTop: 18,
            }}>
            Pls connect to wifi
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const Styles = StyleSheet.create({
  text: {fontSize: 20, color: '#80868a'},
});
