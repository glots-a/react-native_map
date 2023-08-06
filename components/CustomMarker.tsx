import { Image } from 'react-native';
import React from 'react';

const CustomMarker = () => {
  return (
    <Image
      source={require('../assets/img/marker.png')}
      style={{ width: 14, height: 14 }}
    />
  );
};

export default CustomMarker;
