import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import TextView from '../common/TextView';

export default function DeviceScreen() {
  const [Manufacturer, setManufacturer] = useState(null);
  const [Brand, setBrand] = useState(null);
  const [DeviceName, setDeviceName] = useState(null);
  const [DeviceID, setDeviceID] = useState(null);
  const [Fingerprint, setFingerprint] = useState(null);
  const [Hardware, setHardware] = useState(null);
  const [Model, setModel] = useState(null);

  useEffect(() => {
    getDataAsync();
  }, []);

  const getDataAsync = async () => {
    try {
      let brand = DeviceInfo.getBrand();
      setBrand(brand);
      let deviceId = DeviceInfo.getDeviceId();
      setDeviceID(deviceId);
      await DeviceInfo.getManufacturer().then(data => setManufacturer(data));
      await DeviceInfo.getDeviceName().then(data => setDeviceName(data));

      await DeviceInfo.getFingerprint().then(data => setFingerprint(data));
      await DeviceInfo.getHardware().then(data => setHardware(data));
      await DeviceInfo.getProduct().then(data => setModel(data));
    } catch (e) {
      console.error('Trouble getting device info ', e);
    }
  };
  return (
    <ScrollView style={{flex: 1, backgroundColor: '#ffffe080', flexGrow: 1}}>
      <View
        style={{
          margin: 10,
          backgroundColor: '#ffffff',
          borderRadius: 12,
          padding: 10,
          elevation: 4,
        }}>
        <TextView name="Device Name" value={DeviceName} />
        <TextView name="Model" value={Model} />
        <TextView name="Manufacturer" value={Manufacturer} />
        <TextView name="Device" value={DeviceName} />
        <TextView name="Board" value={Hardware} />
        <TextView name="Hardware" value={Hardware} />
        <TextView name="Brand" value={Brand} />
        <TextView name="Device ID" value={DeviceID} />
        <TextView name="Build Fingerprint" value={Fingerprint} />
      </View>
    </ScrollView>
  );
}
