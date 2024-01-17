import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import networkSpeed from 'react-native-network-speed';

const NetWorkSpeed = () => {
  const [downLoadSpeed, SetDownLoadSpeed] = useState(0);
  const [appDownLoadSpeed, SetAppDownLoadSpeed] = useState(0);
  const [upLoadSpeed, SetUpLoadSpeed] = useState(0);
  const [appUpLoadSpeed, SetAppUpLoadSpeed] = useState(0);

  useEffect(() => {
    networkSpeed.startListenNetworkSpeed(
      ({
        downLoadSpeed,
        downLoadSpeedCurrent,
        upLoadSpeed,
        upLoadSpeedCurrent,
      }) => {
        SetDownLoadSpeed(downLoadSpeed + ' kb/s'); // download speed for the entire device 整个设备的下载速度
        SetAppDownLoadSpeed(downLoadSpeedCurrent + ' kb/s'); // download speed for the current app 当前app的下载速度(currently can only be used on Android)
        SetUpLoadSpeed(upLoadSpeed + ' kb/s'); // upload speed for the entire device 整个设备的上传速度
        SetAppUpLoadSpeed(upLoadSpeedCurrent + ' kb/s'); // upload speed for the current app 当前app的上传速度(currently can only be used on Android)
      },
    );

    return () => {
      networkSpeed.stopListenNetworkSpeed;
    };
  }, []);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
      }}>
      <View style={Styles.container}>
        <Text style={Styles.text}>Device Network Speed</Text>
        <View style={Styles.speedTextView}>
          <Text style={Styles.textDownload}>{downLoadSpeed}</Text>
          <Text style={Styles.textUpload}>{upLoadSpeed}</Text>
        </View>
      </View>
      <View style={Styles.container}>
        <Text style={Styles.text}>App Network Speed</Text>
        <View style={Styles.speedTextView}>
          <Text style={Styles.textDownload}>{appDownLoadSpeed}</Text>
          <Text style={Styles.textUpload}>{appUpLoadSpeed}</Text>
        </View>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 4,
    margin: 10,
    padding: 10,
    width: '45%',
  },
  speedTextView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 5,
  },
  textDownload: {
    fontSize: 14,
    color: '#00ff0090',
  },
  textUpload: {
    fontSize: 14,
    color: '#0000ff90',
  },
  text: {
    alignSelf: 'center',
    color: '#05b5beaa',
  },
});

export default NetWorkSpeed;
