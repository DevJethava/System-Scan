import React from 'react';
import {Image, Text, View} from 'react-native';

export default function AppView(props) {
  const DATA = props.item;

  return (
    <View
      style={{
        marginHorizontal: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        elevation: 4,
      }}>
      <Image
        source={{uri: `data:image/png;base64,${DATA.item.icon}`}}
        style={{
          height: 50,
          width: 50,
          borderWidth: 2,
          borderRadius: 50,
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          marginTop: 2,
          flexDirection: 'column',
          marginLeft: 15,
        }}>
        <Text style={{fontSize: 16, color: 'black'}}>
          {DATA.item?.label || DATA.item?.appName}
        </Text>

        <Text
          style={{fontSize: 14, color: '#05b5be', marginTop: 2, fontSize: 14}}>
          {DATA.item.packageName}
        </Text>
      </View>
    </View>
  );
}
