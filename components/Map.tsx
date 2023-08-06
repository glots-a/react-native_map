import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import { GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '../environments';
import Constants from 'expo-constants';
import { useEffect, useRef, useState } from 'react';
import MapViewDirections from 'react-native-maps-directions';
import InputAutocomplete from './InputAutocomplete';
import RouteInformation from './RouteInformation';
import RouteInfoMarker from './InputAutocomplete';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_POSITION = {
  latitude: 49.34991,
  longitude: 23.50561,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

interface Place {
  country: string;
  city: string;
  street: string;
}

export default function Main() {
  const [origin, setOrigin] = useState<LatLng | null>();
  const [destination, setDestination] = useState<LatLng | null>();
  const [showDirections, setShowDirections] = useState(false);
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [alternativeRoute, setAlternativeRoute] = useState<string>('');
  const [originPlace, setOriginPlace] = useState<Place | null>(null);
  const [destinationPlace, setDestinationPlace] = useState<Place | null>(null);
  const [mainPolyMarker, setMainPolyLineMarker] = useState<LatLng | null>();
  const [alterPolyMarker, setAlterPolyLineMarker] = useState<LatLng | null>();
  const [alterDistance, setAlterDistance] = useState<number>(0);
  const [alterDuration, setAlterDuration] = useState<number>(0);
  console.log('distsnce', distance, alterDistance);

  const handleResetInputValuesAll = () => {
    setDistance(0);
    setDuration(0);
    setDestination(null);
    setOrigin(null);
    setOriginPlace(null);
    setDestinationPlace(null);
    setDistance(0);
    setDuration(0);
    setShowDirections(false);
    setMainPolyLineMarker(null);
    setAlterPolyLineMarker(null);
    setAlterDistance(0);
    setAlterDuration(0);
  };

  const fetchAlternativeRoute = async () => {
    if (!origin || !destination) {
      console.error('Origin or destination is not set');
      return;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&alternatives=true&key=${GOOGLE_API_KEY}`,
      );
      const data = await response.json();
      if (data.routes.length >= 2) {
        // Assuming data.routes[0] is the main route and data.routes[1] is the alternative route
        setAlternativeRoute(data.routes[1].overview_polyline.points);
      }
    } catch (error) {
      console.error('Error fetching alternative route:', error);
    }
  };

  const mapRef = useRef<MapView>(null);

  const handleInputReset = (flag: 'origin' | 'destination') => {
    if (flag === 'origin') {
      setOrigin(null);
    } else if (flag === 'destination') {
      setDestination(null);
    }
    setShowDirections(false);
    setDistance(0);
    setDuration(0);
  };

  const moveTo = async (position: LatLng) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };

  const edgePaddingValue = 70;

  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  };

  const traceRouteOnReady = (
    args: any,
    flag: 'main' | 'alter',
    triger: number,
  ) => {
    const handleDistance = flag === 'main' ? setDistance : setAlterDistance;
    const handleDuration = flag === 'main' ? setDuration : setAlterDuration;
    const handlePolyMarker =
      flag === 'main' ? setMainPolyLineMarker : setAlterPolyLineMarker;

    if (args) {
      handleDistance(args.distance);
      handleDuration(args.duration);

      const index = Math.floor(args.coordinates.length / triger);
      console.log(index);
      handlePolyMarker(args.coordinates[index]);
    }
  };

  const traceRoute = () => {
    if (origin && destination) {
      setShowDirections(true);
      mapRef.current?.fitToCoordinates([origin, destination], { edgePadding });
    }
  };

  const handlePlaceSelected = (
    details: GooglePlaceDetail | null,
    flag: 'origin' | 'destination',
  ) => {
    const set = flag === 'origin' ? setOrigin : setDestination;
    const setPlace = flag === 'origin' ? setOriginPlace : setDestinationPlace;

    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0,
    };

    let country = '';
    let city = '';
    let street = '';

    if (details?.address_components) {
      details.address_components.forEach((component) => {
        if (component.types.includes('country')) {
          country = component.long_name;
        } else if (component.types.includes('locality')) {
          city = component.long_name;
        } else if (component.types.includes('route')) {
          street = component.long_name;
        }
      });
    }

    setPlace({ country, city, street });
    set(position);
    moveTo(position);
  };

  const decodePolyline = (encoded: string, limit: number): LatLng[] => {
    const poly: LatLng[] = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b;
      let shift = 0;
      let result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      poly.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    const filtrationVar = Math.ceil(poly.length / limit);
    const normalizePoly = [];

    for (let i = 0; i < poly.length; i += filtrationVar) {
      normalizePoly.push(poly[i]);
    }

    return normalizePoly;
  };

  useEffect(() => {
    if (origin && destination) {
      fetchAlternativeRoute();
    }
  }, [origin, destination]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_POSITION}
      >
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}
        {mainPolyMarker && (
          <RouteInfoMarker
            position={mainPolyMarker}
            routeDuration={duration}
            routeDistance={distance}
            isActive={true}
          />
        )}
        {alterPolyMarker && (
          <RouteInfoMarker
            position={alterPolyMarker}
            routeDuration={alterDistance}
            routeDistance={alterDuration}
          />
        )}
        {showDirections && origin && destination && (
          <>
            {/* Alternative route */}
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={GOOGLE_API_KEY}
              strokeColor="#888"
              strokeWidth={4}
              waypoints={decodePolyline(alternativeRoute, 10)}
              onReady={(args) => traceRouteOnReady(args, 'alter', 1.5)}
            />
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={GOOGLE_API_KEY}
              strokeColor="#665cd1"
              strokeWidth={4}
              onReady={(args) => traceRouteOnReady(args, 'main', 4)}
              // optimizeWaypoints={true} !!!! to avoid google biling I put this option to default value (false)
            />
          </>
        )}
      </MapView>
      {distance && destination ? (
        <></>
      ) : (
        <View style={styles.searchContainer}>
          <InputAutocomplete
            label="Початкова точка"
            isInputValue={!!origin}
            onPlaceSelected={(details) => {
              handlePlaceSelected(details, 'origin');
            }}
            onReset={() => handleInputReset('origin')}
          />
          <InputAutocomplete
            label="Кінцева точка"
            isInputValue={!!destination}
            onPlaceSelected={(details) => {
              handlePlaceSelected(details, 'destination');
            }}
            onReset={() => handleInputReset('destination')}
          />
          <TouchableOpacity style={styles.button} onPress={traceRoute}>
            <Text style={styles.buttonText}>Побудувати маршрут</Text>
          </TouchableOpacity>
        </View>
      )}
      {distance && duration ? (
        <>
          <RouteInformation
            originPlace={originPlace}
            destinationPlace={destinationPlace}
            distance={distance}
            duration={duration}
            onResetInputValues={handleResetInputValuesAll}
          />
          <TouchableOpacity>
            <Text>Обрати Маршрут</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  searchContainer: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#0F0F0F',
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight,
  },
  button: {
    backgroundColor: '#7E57C2',
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 4,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
  },
});
