import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import TextView from '../common/TextView';

export default function BatteryScreen() {
  const [BatteryLevel, setBatteryLevel] = useState('');

  useEffect(() => {
    DeviceInfo.getPowerState().then(data => {
      setBatteryLevel(data);
    });
  }, []);

  return BatteryLevel != '' ? (
    <View
      style={{
        margin: 10,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 10,
        elevation: 4,
      }}>
      <TextView
        name="BatteryLevel"
        value={BatteryLevel.batteryLevel * 100 + '%'}
      />
      <TextView name="BatteryState" value={BatteryLevel.batteryState} />
      <TextView
        name="LowPowerMode"
        value={BatteryLevel.lowPowerMode ? 'True' : 'False'}
      />
    </View>
  ) : null;
}
