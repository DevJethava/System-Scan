import React, {useEffect, useState} from 'react';
import {View, ScrollView} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import TextView from '../common/TextView';

export default function SystemScreen() {
  const [ApiLevel, setApiLevel] = useState(null);
  const [SystemVersion, setSystemVersion] = useState(null);
  const [InstanceId, setInstanceId] = useState(null);
  const [SecurityPatch, setSecurityPatch] = useState(null);
  const [Bootloader, setBootloader] = useState('');
  const [BuildNumber, setBuildNumber] = useState('');
  const [UserAgent, setUserAgent] = useState('');

  useEffect(() => {
    getDataAsync();
  }, []);

  const getDataAsync = async () => {
    try {
      let SystemVersion = DeviceInfo.getSystemVersion();
      setSystemVersion(SystemVersion);
      let buildno = DeviceInfo.getBuildNumber();
      setBuildNumber(buildno);

      await DeviceInfo.getInstanceId().then(data => setInstanceId(data));
      await DeviceInfo.getApiLevel().then(data => setApiLevel(data));
      await DeviceInfo.getSecurityPatch().then(data => setSecurityPatch(data));
      await DeviceInfo.getBootloader().then(data => setBootloader(data));
      await DeviceInfo.getUserAgent().then(data => setUserAgent(data));
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
        <TextView name="Device version" value={SystemVersion} />
        <TextView name="Api Level" value={ApiLevel} />
        <TextView name="Released" value={SecurityPatch} />
      </View>
      <View
        style={{
          margin: 10,
          backgroundColor: '#ffffff',
          borderRadius: 12,
          padding: 10,
          elevation: 4,
        }}>
        <TextView name="Code Name" value={SystemVersion} />
        <TextView name="API Level" value={ApiLevel} />
        <TextView name="Security Patch Level" value={SecurityPatch} />
        <TextView name="BootLoader" value={Bootloader} />
        <TextView name="Build Number" value={BuildNumber} />
        <TextView name="UserAgent" value={UserAgent} />
        <TextView name="Instance ID" value={InstanceId} />
      </View>
    </ScrollView>
  );
}
