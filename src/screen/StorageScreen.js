import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import DeviceInfo from 'react-native-device-info';
import TextView from '../common/TextView';

export default function StorageScreen() {
  const [getTotalMemory, setgetTotalMemory] = useState(null);
  const [getTotalDiskCapacity, setgetTotalDiskCapacity] = useState(null);
  const [getFreeDiskStorage, setgetFreeDiskStorage] = useState(null);
  const [getFreeDiskStorageOld, setgetFreeDiskStorageOld] = useState(null);

  useEffect(() => {
    Storage();
  }, []);

  const Storage = async () => {
    await DeviceInfo.getTotalMemory().then(data =>
      setgetTotalMemory((data / 1073741824).toFixed(2)),
    );
    await DeviceInfo.getTotalDiskCapacity().then(data =>
      setgetTotalDiskCapacity((data / 1073741824).toFixed(2)),
    );
    await DeviceInfo.getFreeDiskStorage().then(data =>
      setgetFreeDiskStorage((data / 1073741824).toFixed(2)),
    );
    await DeviceInfo.getFreeDiskStorageOld().then(data => {
      setgetFreeDiskStorageOld((data / 1073741824).toFixed(2));
    });
  };

  return (
    <View
      style={{
        margin: 10,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 10,
        elevation: 4,
      }}>
      <TextView name="Memory" value={getTotalMemory + ' GB'} />
      <TextView name="Disk Capacity" value={getTotalDiskCapacity + ' GB'} />
      <TextView name="Free Disk" value={getFreeDiskStorage + ' GB'} />
      <TextView name="Old Free Disk" value={getFreeDiskStorageOld + ' GB'} />
    </View>
  );
}
