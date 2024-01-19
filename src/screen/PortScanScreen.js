import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import Port from '../common/Port';
import TcpSocket from 'react-native-tcp-socket';

const PortScanScreen = props => {
  const [scan, setScan] = useState(false);
  const [open, setOpen] = useState([]);
  const targetPorts = Port;
  const DATA = props.route.params.items;

  useEffect(() => {
    checkPortsOnIPs();
  }, []);

  const checkPortsOnIPs = () => {
    setOpen([]);
    setScan(true);

    targetPorts.forEach(port => {
      checkPortStatus(DATA.ip, port);
    });
  };

  const checkPortStatus = (ip, port) => {
    const client = TcpSocket.createConnection({host: ip, port: port}, () => {
      client.destroy();
    });

    client.on('connect', () => {
      setOpen(ols => [...ols, {ip_: ip, port_: port}]);
      if (port === targetPorts[targetPorts.length - 1]) {
        setScan(false);
      }
      client.destroy();
    });

    client.on('error', error => {
      if (port === targetPorts[targetPorts.length - 1]) {
        setScan(false);
      }
      client.destroy();
    });
  };

  const renderItem = ({item, index}) => (
    <View
      style={{
        margin: 10,
        flexDirection: 'row',
        marginHorizontal: 15,
        justifyContent: 'space-between',
        paddingRight: 20,
        borderBottomColor: '#d3d3d386',
        borderBottomWidth: 1,
        padding: 2,
        marginBottom: 3,
      }}>
      <Text style={{fontSize: 15, color: '#34bbd3a6', marginLeft: 15}}>
        {index + 1}.
      </Text>
      <Text style={{fontSize: 15, color: '#d36318'}}>{DATA.ip}</Text>
      <Text style={{fontSize: 15, color: '#d36318'}}>{item.port_}</Text>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#ffffe060'}}>
      <View style={{padding: 20}}>
        <Text style={{fontSize: 28, color: '#483786', fontWeight: '600'}}>
          {DATA.hostname}
        </Text>
        <Text style={{fontSize: 23, marginTop: 8}}>{DATA.ip}</Text>
        <Text style={{fontSize: 18, marginTop: 7}}>{DATA.mac}</Text>
      </View>
      {open.length == 0 && scan == false ? (
        <Text style={{color: 'green', fontSize: 20, padding: 30}}>
          No Open Ports Found ...
        </Text>
      ) : (
        <FlatList
          data={open}
          keyExtractor={item => item.port_}
          renderItem={renderItem}
        />
      )}
      {scan ? (
        <View style={{alignItems: 'center', marginBottom: 50}}>
          <Text
            style={{
              fontSize: 22,
              color: 'red',
            }}>
            Scanning....
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={checkPortsOnIPs}
          style={{
            marginHorizontal: 80,
            marginBottom: 30,
            padding: 10,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#74e70a30',
          }}>
          <Text style={{fontSize: 18, fontWeight: '600', color: '#72c9cfff'}}>
            Re Scan
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PortScanScreen;
