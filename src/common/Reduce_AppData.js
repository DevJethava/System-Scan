import React from 'react';
import { Text, View } from 'react-native';

export const Reduce_AppData = props => {
  const DATA = props.item;

  return (
    <View
      style={{
        margin: 3,
        borderWidth: 1,
        padding: 5,
        borderRadius: 5,
        borderColor: '#05b5be50',
        backgroundColor: '#d0f3eb6c',
        paddingLeft: 20,
      }}>
      <View style={{ flexDirection: 'row', marginTop: 2 }}>
        <Text
          style={{
            fontSize: 14,
            color: 'black',
            fontSize: 16,
            marginRight: 20,
          }}>
          {DATA.index + 1}.
        </Text>
        <Text style={{ fontSize: 14, color: '#05b5be', fontSize: 16 }}>
          {DATA.item.label}
        </Text>
      </View>
      <Text
        style={{ fontSize: 14, color: 'black', marginTop: 2, fontSize: 14 }}>
        {DATA.item.packageName}
      </Text>
    </View>
  );
};
