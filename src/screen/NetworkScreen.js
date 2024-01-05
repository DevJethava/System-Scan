import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import TextView from '../common/TextView';
import axios from 'axios';

export default function NetworkScreen() {
  const [networkData, setNetWorkData] = useState('');
  const [onlineData, serOnlineData] = useState('');

  useEffect(() => {
    const unSubscribe = NetInfo.addEventListener(dat => {
      setNetWorkData(dat);
      SpeedTest();
    });

    return () => {
      unSubscribe && unSubscribe();
    };
  }, []);

  const SpeedTest = async () => {
    axios
      .get(
        // 'https://ipapi.co/json/',
        'https://ipinfo.io/',
        // 'https://ip.guide/',
      )
      .then(data => {
        // console.log(JSON.stringify(data.data, '', 2));
        serOnlineData(data.data);
      })
      .catch(error => {
        console.log(error, 'erorr Device');
      });
  };
  console.log(JSON.stringify(onlineData, '', 2));

  const LiveData = () => {
    return onlineData != '' ? (
      <View
        style={{
          margin: 10,
          backgroundColor: '#ffffff',
          borderRadius: 12,
          padding: 10,
          elevation: 4,
        }}>
        <TextView name={'Network IP'} value={onlineData.ip} />
        <TextView name={'City'} value={onlineData.city} />
        <TextView name={'Region'} value={onlineData.region} />
        <TextView name={'Country'} value={onlineData.country} />
        <TextView name={'Location'} value={onlineData.loc} />
        <TextView name={'Organigation'} value={onlineData.org} />
        <TextView name={'Postal'} value={onlineData.postal} />
        <TextView name={'Time Zone'} value={onlineData.timezone} />
      </View>
    ) : null;
  };

  return networkData.isConnected == true ? (
    networkData.type == 'wifi' ? (
      <ScrollView style={{flexGrow: 1}}>
        <View
          style={{
            margin: 10,
            backgroundColor: '#ffffff',
            borderRadius: 12,
            padding: 10,
            elevation: 4,
          }}>
          <TextView name={'Type'} value={networkData.type} />
          <TextView name={'IP Address'} value={networkData.details.ipAddress} />
          <TextView name={'Gateway'} value={networkData.details.ipAddress} />
          <TextView name={'Subnet Mask'} value={networkData.details.subnet} />
          <TextView name={'DHCP Server'} value={networkData.details.subnet} />
          <TextView name={'DNS 1'} value={networkData.details.subnet} />
          <TextView name={'Link Speed'} value={networkData.details.linkSpeed} />
          <TextView name={'Frequency'} value={networkData.details.frequency} />
          <TextView name={'Strength'} value={networkData.details.strength} />
          <TextView name={'BssID'} value={networkData.details.bssid} />
          <TextView
            name={'isInternetReachable'}
            value={networkData.details.isInternetReachable ? 'False' : 'True'}
          />
        </View>
        <LiveData />
      </ScrollView>
    ) : (
      <ScrollView style={{flexGrow: 1}}>
        <View
          style={{
            margin: 10,
            backgroundColor: '#ffffff',
            borderRadius: 12,
            padding: 10,
            elevation: 4,
          }}>
          <TextView name={'Type'} value={networkData.type} />
          <TextView name={'Carrier'} value={networkData.details.carrier} />
          <TextView
            name={'CellularGeneration'}
            value={networkData.details.cellularGeneration}
          />
          <TextView
            name={'isInternetReachable'}
            value={networkData.details.isInternetReachable ? 'False' : 'True'}
          />
        </View>
        <LiveData />
      </ScrollView>
    )
  ) : (
    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <Text style={{fontSize: 20, color: 'black', fontWeight: 'bold'}}>
        Not Connected to Network
      </Text>
    </View>
  );
}
