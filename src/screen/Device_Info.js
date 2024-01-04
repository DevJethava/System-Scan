import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';

export const Device_Info = () => {
  const [Manufacturer, setManufacturer] = useState(null);
  const [BuildId, setBuildId] = useState(null);
  const [DeviceName, setDeviceName] = useState(null);
  const [ApiLevel, setApiLevel] = useState(null);
  const [hasNotch, sethasNotch] = useState(null);
  const [IpAddress, setIpAddress] = useState(null);
  const [MacAddress, setMacAddress] = useState(null);
  const [BatteryLevel, setBatteryLevel] = useState(null);
  const [isLandscape, setisLandscape] = useState(null);
  const [isAirplaneMode, setisAirplaneMode] = useState(null);
  const [isBatteryCharging, setisBatteryCharging] = useState(null);
  const [isPinOrFingerprintSet, setisPinOrFingerprintSet] = useState(null);
  const [supportedAbis, setsupportedAbis] = useState(null);
  const [isLocationEnabled, setisLocationEnabled] = useState(null);
  const [isHeadphonesConnected, setisHeadphonesConnected] = useState(null);
  const [device, setdevice] = useState(null);
  const [Display, setDisplay] = useState(null);
  const [Fingerprint, setFingerprint] = useState(null);
  const [Hardware, setHardware] = useState(null);
  const [Host, setHost] = useState(null);
  const [Product, setProduct] = useState(null);
  const [PreviewSdkInt, setPreviewSdkInt] = useState(null);
  const [Incremental, setIncremental] = useState(null);
  const [syncUniqueId, setsyncUniqueId] = useState(null);
  const [DeviceId, setDeviceId] = useState(null);
  const [getBundleId, setgetBundleId] = useState(null);
  const [SystemVersion, setSystemVersion] = useState(null);
  const [isTablet, setisTablet] = useState(null);
  const [ApplicationName, setApplicationName] = useState(null);
  const [InstanceId, setInstanceId] = useState(null);
  const [SecurityPatch, setSecurityPatch] = useState(null);
  const [getTotalMemory, setgetTotalMemory] = useState(null);
  const [getTotalDiskCapacity, setgetTotalDiskCapacity] = useState(null);
  const [getFreeDiskStorage, setgetFreeDiskStorage] = useState(null);
  const [networkData, setNetWorkData] = useState('');

  useEffect(() => {
    getDataAsync();
    SpeedTest();
  }, []);

  const getDataAsync = async () => {
    try {
      let DeviceId = DeviceInfo.getDeviceId();
      setDeviceId(DeviceId);
      let HasNotch = DeviceInfo.hasNotch();
      sethasNotch(HasNotch);
      let SystemVersion = DeviceInfo.getSystemVersion();
      setSystemVersion(SystemVersion);
      let Tablet = DeviceInfo.isTablet();
      setisTablet(Tablet);
      let applicationName = DeviceInfo.getApplicationName();
      setApplicationName(applicationName);
      let BundleId = DeviceInfo.getBundleId();
      setgetBundleId(BundleId);

      await DeviceInfo.getTotalMemory().then(data =>
        setgetTotalMemory((data / 1073741824).toFixed(2)),
      );
      await DeviceInfo.getTotalDiskCapacity().then(data =>
        setgetTotalDiskCapacity((data / 1073741824).toFixed(2)),
      );
      await DeviceInfo.getFreeDiskStorage().then(data =>
        setgetFreeDiskStorage((data / 1073741824).toFixed(2)),
      );
      await DeviceInfo.getBatteryLevel().then(data =>
        setBatteryLevel((data * 100).toFixed(2)),
      );
      await DeviceInfo.isBatteryCharging().then(data =>
        setisBatteryCharging(data),
      );
      await DeviceInfo.isPinOrFingerprintSet().then(data =>
        setisPinOrFingerprintSet(data),
      );
      await DeviceInfo.isLocationEnabled().then(data =>
        setisLocationEnabled(data),
      );
      await DeviceInfo.isHeadphonesConnected().then(data =>
        setisHeadphonesConnected(data),
      );

      await DeviceInfo.getManufacturer().then(data => setManufacturer(data));
      await DeviceInfo.getBuildId().then(data => setBuildId(data));
      await DeviceInfo.getDeviceName().then(data => setDeviceName(data));
      await DeviceInfo.getInstanceId().then(data => setInstanceId(data));
      await DeviceInfo.getIpAddress().then(data => setIpAddress(data));
      await DeviceInfo.getMacAddress().then(data => {
        data != '' ? setMacAddress(data) : setMacAddress('No Mac Found');
      });
      await DeviceInfo.getApiLevel().then(data => setApiLevel(data));
      await DeviceInfo.isLandscape().then(data => setisLandscape(data));
      await DeviceInfo.isAirplaneMode().then(data => setisAirplaneMode(data));
      await DeviceInfo.supportedAbis().then(data => setsupportedAbis(data));
      await DeviceInfo.getDevice().then(data => setdevice(data));
      await DeviceInfo.getDisplay().then(data => setDisplay(data));
      await DeviceInfo.getFingerprint().then(data => setFingerprint(data));
      await DeviceInfo.getHardware().then(data => setHardware(data));
      await DeviceInfo.getHost().then(data => setHost(data));
      await DeviceInfo.getProduct().then(data => setProduct(data));
      await DeviceInfo.getPreviewSdkInt().then(data => setPreviewSdkInt(data));
      await DeviceInfo.getSecurityPatch().then(data => setSecurityPatch(data));
      await DeviceInfo.getIncremental().then(data => setIncremental(data));
      await DeviceInfo.syncUniqueId().then(data => setsyncUniqueId(data));
    } catch (e) {
      console.error('Trouble getting device info ', e);
    }
  };

  const SpeedTest = async () => {
    axios
      .get(
        // 'https://ipapi.co/json/',
        'https://ipinfo.io/',
        // 'https://ip.guide/',
      )
      .then(data => {
        console.log(JSON.stringify(data.data, '', 2));
        setNetWorkData(data.data);
      })
      .catch(error => {
        console.log(error, 'erorr Device');
        setTimeout(() => {
          SpeedTest();
        }, 2000);
      });
  };

  return (
    <View
      style={{flex: 1, paddingHorizontal: 10, backgroundColor: '#e0e0e050'}}>
      <Text
        style={{
          fontSize: 20,
          marginTop: 20,
          marginBottom: 10,
          marginLeft: 15,
          color: '#909109',
        }}>
        Device Information
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.mianHeader}>System Details</Text>
          <Text style={styles.text}>Manufacturer :- {Manufacturer}</Text>
          <Text style={styles.text}>Model :- {Product}</Text>
          <Text style={styles.text}>Device Name:- {DeviceName}</Text>
          <Text style={styles.text}>Version :- {SystemVersion}</Text>

          <Text style={styles.text}>MacAddress :- {MacAddress}</Text>

          <Text style={styles.text}>Hardware :- {Hardware}</Text>
          <Text style={styles.text}>UniqueId :- {syncUniqueId}</Text>
          <Text style={styles.text}>BuildId :- {BuildId}</Text>
          <Text style={styles.text}>DeviceId :- {DeviceId}</Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.mianHeader}>Display Details</Text>
          <Text style={styles.text}>Display :- {Display}</Text>
          <Text style={styles.text}>HasNotch :- {hasNotch ? 'Yes' : 'No'}</Text>
          <Text style={styles.text}>
            Landscape :- {isLandscape ? 'Yes' : 'No'}
          </Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.mianHeader}>Battery Details</Text>
          <Text style={styles.text}>BatteryLevel :- {BatteryLevel} %</Text>
          <Text style={styles.text}>
            BatteryCharging :- {isBatteryCharging ? 'Yes' : 'No'}
          </Text>
        </View>

        <View style={styles.container}>
          <Text style={styles.mianHeader}>Storage Details</Text>
          <Text style={styles.text}>
            Total Storage :- {getTotalDiskCapacity} GB
          </Text>
          <Text style={styles.text}>
            Free Storage :- {getFreeDiskStorage} GB
          </Text>
          <Text style={styles.text}>Total Ram :- {getTotalMemory} GB</Text>
        </View>

        <View style={styles.container}>
          <Text style={styles.mianHeader}>Security Details</Text>
          <Text style={styles.text}>SecurityPatch :- {SecurityPatch}</Text>
          <Text style={styles.text}>Fingerprint :- {Fingerprint}</Text>
          <Text style={styles.text}>
            Pin Or FingerprintSet :- {isPinOrFingerprintSet ? 'Yes' : 'No'}
          </Text>
        </View>

        <View style={styles.container}>
          <Text style={styles.mianHeader}>App Details</Text>
          <Text style={styles.text}>Name :- {ApplicationName}</Text>
          <Text style={styles.text}>BundleId :- {getBundleId}</Text>
          <Text style={styles.text}>ApiLevel :- {ApiLevel}</Text>
          <Text style={styles.text}>Host :- {Host}</Text>
          <Text style={styles.text}>PreviewSdkInt :- {PreviewSdkInt}</Text>
        </View>

        <View style={styles.container}>
          <Text style={styles.mianHeader}>Mobile Details</Text>
          <Text style={styles.text}>IpAddress :- {IpAddress}</Text>
          <Text style={styles.text}>
            AirplaneModeon :- {isAirplaneMode ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.text}>supportedAbis :- {supportedAbis}</Text>
          <Text style={styles.text}>
            LocationEnabled :- {isLocationEnabled ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.text}>
            HeadphonesConnected :- {isHeadphonesConnected ? 'Yes' : 'No'}
          </Text>

          <Text style={styles.text}>device :- {device}</Text>
          <Text style={styles.text}>tablet :- {isTablet ? 'Yes' : 'No'}</Text>
          <Text style={styles.text}>Incremental :- {Incremental}</Text>
          <Text style={styles.text}>InstanceId :- {InstanceId}</Text>
        </View>

        {networkData != '' ? (
          <View style={styles.container}>
            <Text style={styles.mianHeader}>Network Details</Text>
            <Text style={styles.text}>Local Ip : {networkData.ip}</Text>
            <Text style={styles.text}>Provider : {networkData.org}</Text>
            <Text style={styles.text}>
              Location : {networkData.city}, {networkData.region},{' '}
              {networkData.country_name}.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 3,
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    borderColor: '#05b5be50',
    backgroundColor: '#d0f3eb6c',
    paddingLeft: 20,
  },
  mianHeader: {
    color: '#05b5be',
    fontSize: 16,
    paddingVertical: 10,
    fontWeight: '500',
  },
  text: {fontSize: 14, color: 'black', marginTop: 2},
});
