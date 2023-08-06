import React from 'react';
import { Marker, LatLng } from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';

interface RouteInfoMarkerProps {
  routeDuration: number;
  routeDistance: number;
  position: LatLng | null;
  isActive?: boolean;
}

const RouteInfoMarker: React.FC<RouteInfoMarkerProps> = ({
  routeDuration,
  routeDistance,
  position,
  isActive,
}) => {
  if (!position) {
    return null;
  }

  const hour = Math.floor(routeDuration / 60);
  const minutes = (routeDuration - hour * 60).toFixed(0);

  const newLatitude = position.latitude + 0.02;
  const newLongitude = position.longitude;

  const markerStyles = StyleSheet.compose(
    styles.markerContainer,
    isActive ? styles.active : null,
  );

  return (
    <Marker
      coordinate={{ latitude: newLatitude, longitude: newLongitude }}
      anchor={{ x: 0.5, y: 1.0 }}
    >
      <View style={markerStyles}>
        <Text style={styles.durationText}>{`${hour}год. ${minutes}хв`}</Text>
        <Text style={styles.distanceText}>{routeDistance.toFixed(0)}км</Text>
      </View>
    </Marker>
  );
};

export default RouteInfoMarker;

const styles = StyleSheet.create({
  markerContainer: {
    width: 84,
    height: 42,
    backgroundColor: '#0F0F0F',
    borderRadius: 5,
    paddingLeft: 5,
  },
  active: {
    borderWidth: 3,
    borderColor: '#202052',
    borderStyle: 'solid',
  },
  durationText: {
    color: '#EBEBEB',
    fontSize: 14,
    fontWeight: '200',
  },
  distanceText: {
    color: '#C4C4C4',
    fontSize: 11,
    fontWeight: '200',
  },
});
