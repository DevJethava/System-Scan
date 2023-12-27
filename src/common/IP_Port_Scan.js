import React, {useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import TcpSocket from 'react-native-tcp-socket';
import Port from './Port';

const IP_Port_Scan = props => {
  const IPS = props.route.params.IP;
  const targetIPs = IPS;
  const targetPorts = Port;
  const [scan, setScan] = useState(false);
  const [open, setOpen] = useState([]);

  const checkPortsOnIPs = () => {
    setOpen([]);
    setScan(true);

    targetIPs.forEach(ip => {
      targetPorts.forEach(port => {
        checkPortStatus(ip, port);
      });
    });
  };

  const checkPortStatus = (ip, port) => {
    const client = TcpSocket.createConnection({
      host: ip,
      port: port,
    });

    client.on('connect', () => {
      setOpen(old => [...old, {ip_: ip, port_: port}]);
      if (
        port == targetPorts[targetPorts.length - 1] &&
        ip == targetIPs[targetIPs.length - 1]
      ) {
        setScan(false);
        console.log('Done! Port Scan');
      }
      client.destroy(); // Close the socket connection
    });

    client.on('error', error => {
      if (
        port == targetPorts[targetPorts.length - 1] &&
        ip == targetIPs[targetIPs.length - 1]
      ) {
        setScan(false);
        console.log('Done! Port Scan');
      }
      // console.log(`Port ${port} is closed on ${ip}`);
      client.destroy(); // Close the socket connection
    });
  };

  useEffect(() => {
    checkPortsOnIPs();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#b8c553ff',
        borderRadius: 10,
      }}>
      <Text style={{fontSize: 20, padding: 10, color: '#909109'}}>
        Available port
      </Text>
      <View style={{flex: 1, padding: 10}}>
        <View
          style={{
            marginVertical: 10,
            marginHorizontal: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: 16, color: 'black'}}>No.</Text>
          <Text style={{fontSize: 16, color: 'black'}}>IP Address</Text>
          <Text style={{fontSize: 16, color: 'black'}}>Open Port</Text>
        </View>
        {open == '' && scan == false ? (
          <Text style={{color: 'green', fontSize: 20, padding: 30}}>
            No Open Ports Found ...
          </Text>
        ) : (
          <FlatList
            data={open} // Your data array
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <View
                style={{
                  marginTop: 5,
                  flexDirection: 'row',
                  marginHorizontal: 15,
                  justifyContent: 'space-between',
                  paddingRight: 20,
                }}>
                <Text style={{fontSize: 15, color: '#34bbd3a6'}}>
                  {index + 1}.
                </Text>
                <Text style={{fontSize: 15, color: '#d36318'}}>{item.ip_}</Text>
                <Text style={{fontSize: 15, color: '#d36318'}}>
                  {item.port_}
                </Text>
              </View>
            )}
          />
        )}
      </View>

      {scan ? (
        <View style={{alignItems: 'center', marginBottom: 25}}>
          <Text
            style={{
              fontSize: 18,
              color: 'red',
            }}>
            Scanning....
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={checkPortsOnIPs}
          style={{
            marginHorizontal: 60,
            marginBottom: 30,
            padding: 10,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#74e470ad',
          }}>
          <Text style={{fontSize: 16, fontWeight: '600', color: '#bb9b1bff'}}>
            Re Scan
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default IP_Port_Scan;
