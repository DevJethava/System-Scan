import React from 'react';
import {View, Text} from 'react-native';

export default function TextView({name, value}) {
  return (
    <View
      style={{
        borderBottomColor: '#d3d3d386',
        borderBottomWidth: 1,
        marginHorizontal: 10,
        padding: 2,
        marginBottom: 3,
      }}>
      <Text style={{color: 'black', fontSize: 15}}>{name}</Text>
      <Text style={{color: '#05b5be'}}>{value}</Text>
    </View>
  );
}
