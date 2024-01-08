import React, {useState} from 'react';
import {Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import DeviceScreen from '../screen/DeviceScreen';
import AppScreen from '../screen/AppScreen.js';
import SystemScreen from '../screen/SystemScreen';
import DashBoardScreen from '../screen/DashBoardScreen';
import BatteryScreen from '../screen/BatteryScreen.js';
import NetworkScreen from '../screen/NetworkScreen.js';
import {Device_Info} from '../screen/Device_Info';
import StorageScreen from '../screen/StorageScreen.js';
import {ScanIPConnected} from '../screen/ScanIPConnectedScreen.js';
import TestScreen from '../screen/TestScreen.js';

export default function Routes() {
  const Stack = createNativeStackNavigator();
  const Tab = createMaterialTopTabNavigator();

  const Top_Tab = () => {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          //use this config
          tabBarScrollEnabled: true,
          tabBarIndicator: () => null,

          tabBarItemStyle: {
            width: 'auto',
            alignItems: 'flex-start',
            backgroundColor: '#ffffe060',
          },
          tabBarLabel: ({focused}) => {
            return (
              <Text
                style={{
                  fontSize: 16,
                  color: focused ? 'white' : 'black',
                  textTransform: 'capitalize',
                  borderRadius: 10,
                  fontWeight: focused ? '500' : '400',
                  padding: 6,
                  paddingHorizontal: 14,
                  backgroundColor: focused ? '#d3d3d3c7' : null,
                }}>
                {route.name}
              </Text>
            );
          },
        })}
        sceneContainerStyle={{backgroundColor: '#ffffe060'}}>
        <Tab.Screen name="ScanIP" component={ScanIPConnected} />
        <Tab.Screen name="DashBoard" component={DashBoardScreen} />
        <Tab.Screen name="Device" component={DeviceScreen} />
        <Tab.Screen name="System" component={SystemScreen} />
        <Tab.Screen name="Battery" component={BatteryScreen} />
        <Tab.Screen name="Storage" component={StorageScreen} />
        <Tab.Screen name="NetWork" component={NetworkScreen} />
        <Tab.Screen name="Apps" component={AppScreen} />
        <Tab.Screen name="Test" component={TestScreen} />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Top_Tab" component={Top_Tab} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
