import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import HomeScreen from '../screen/HomeScreen';
import Testing from '../screen/Testing';

export default function Routes() {
  const Stack = createNativeStackNavigator();
  const Tab = createMaterialTopTabNavigator();

  const Top_Tab = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={Testing} />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Top_Tab} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
