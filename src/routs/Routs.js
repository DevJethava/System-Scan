import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Device_Info} from '../screen/Device_Info';
import {Installed_Apps} from '../screen/Installed_Apps';
import {Platform} from 'react-native';
import Testing from '../screen/Testing';
import {Scan_IP_Connected} from '../screen/Scan_IP_Connected';
import Icon from 'react-native-vector-icons/Ionicons';
import IP_Port_Scan from '../common/IP_Port_Scan';

export const Routs = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  function Home() {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused}) => {
            let iconname;
            if (route.name === 'Device Info') {
              iconname = focused
                ? 'information-circle'
                : 'information-circle-outline';
            } else if (route.name === 'Scan_IP_Connected') {
              iconname = focused ? 'cloud-circle' : 'cloud-circle-outline';
            } else if (route.name === 'Port Scan') {
              iconname = focused ? 'git-network' : 'git-network-outline';
            } else if (route.name === 'Installed Apps') {
              iconname = focused ? 'apps' : 'apps-outline';
            } else if (route.name === 'Testing') {
              iconname = focused ? 'construct-sharp' : 'construct-outline';
            }
            return (
              <Icon
                name={iconname}
                size={focused ? 24 : 22}
                color={focused ? '#05b5be' : '#05b5be70'}
              />
            );
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}>
        <Tab.Screen name="Device Info" component={Device_Info} />
        <Tab.Screen name="Scan_IP_Connected" component={Scan_IP_Connected} />
        {Platform.OS == 'ios' ? null : (
          <Tab.Screen name="Installed Apps" component={Installed_Apps} />
        )}
        <Tab.Screen name="Testing" component={Testing} />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="IP_Port_Scan" component={IP_Port_Scan} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
