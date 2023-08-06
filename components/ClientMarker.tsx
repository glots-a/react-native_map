import { Image } from 'react-native';
import React from 'react';

const ClientMarker = () => {
  return (
    <Image
      source={require('../assets/img/customer-marker.png')}
      style={{ width: 14, height: 14 }}
    />
  );
};

export default ClientMarker;
