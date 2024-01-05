import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

export default function TouchableView({name, setData, cuurent}) {
  return (
    <TouchableOpacity
      style={{
        padding: 4,

        backgroundColor: cuurent == name ? '#d3d3d3d8' : 'white',
        paddingHorizontal: 10,
        borderRadius: 10,
        elevation: 4,
      }}
      onPress={() => setData(name)}>
      <Text
        style={{
          color: cuurent == name ? 'white' : 'black',
          fontSize: 15,
          padding: 2,
          backgroundColor: cuurent == name ? '#d3d3d3d8' : 'white',
        }}>
        {name}
      </Text>
    </TouchableOpacity>
  );
}
