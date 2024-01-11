import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {InstalledApps} from 'react-native-launcher-kit';
import AppView from '../common/AppView';
import TouchableView from '../common/TouchableView';
import RNInstalledApplication from 'react-native-installed-application';

export default function AppScreen() {
  const [userApp, setUserApp] = useState(null);
  const [systemApp, setSyatemApp] = useState(null);
  const [allApp, setAllApp] = useState(null);
  const [state, setState] = useState('User');
  const [currentData, setcurrentData] = useState(null);

  useEffect(() => {
    const Apps = InstalledApps.getSortedApps();
    setUserApp(Apps);
    setcurrentData(Apps);

    RNInstalledApplication.getSystemApps()
      .then(apps => {
        setSyatemApp(apps);
      })
      .catch(error => {
        console.log(error);
      });

    RNInstalledApplication.getApps()
      .then(apps => {
        setAllApp(apps);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const SetData = data => {
    if (state != data) {
      switch (data) {
        case 'User':
          setcurrentData(userApp);
          setState(data);
          break;
        case 'System':
          setcurrentData(systemApp);
          setState(data);
          break;
        case 'All':
          setcurrentData(allApp);
          setState(data);
          break;
        default:
          setcurrentData(userApp);
          setState('User');
          break;
      }
    }
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginVertical: 10,
        }}>
        <View
          style={{
            padding: 4,
            backgroundColor: '#d3d3d362',
            paddingHorizontal: 12,
            borderRadius: 10,
          }}>
          <Text style={{padding: 2, color: '#05b5be'}}>
            {currentData !== null ? currentData.length : 0}
          </Text>
        </View>

        <TouchableView name={'User'} setData={SetData} cuurent={state} />
        <TouchableView name={'System'} setData={SetData} cuurent={state} />
        <TouchableView name={'All'} setData={SetData} cuurent={state} />
      </View>
      {currentData !== null ? (
        <FlatList
          data={currentData}
          renderItem={item => <AppView item={item} />}
          initialNumToRender={50}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size={60} />
        </View>
      )}
    </View>
  );
}
