import React from 'react';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';
import { useEffect, useRef, useState } from 'react';
import MapViewDirections from 'react-native-maps-directions';
import InputAutocomplete from './InputAutocomplete';
import RouteInformation from './RouteInformation';
import RouteInfoMarker from './RouteInfoMarker';
import CustomMarker from './CustomMarker';
import * as Location from 'expo-location';
import ClientMarker from './ClientMarker';
import TripCheking from './TripCheking';

const GOOGLE_API_KEY = 'AIzaSyCMrMUK13u0JzReaVOmnLXLhrpv9FWxp8o';

const { width, height } = Dimensions.get('window');

const LOCATION_DISTANCE_THRESSHOLD = 25;
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

export default function Map() {
  const [initialPosition, setInitialPosition] = useState(INITIAL_POSITION);
  const [clientPosition, setClientPosition] = useState<LatLng | null>();
  const [curentAdress, setCurenAdress] = useState('');
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
  const [showStartButton, setShowStartButton] = useState(true);
  const [isClientReady, setIsClientReady] = useState(false);
  const [renderMainRoute, setRenderMainRoute] = useState(false);
  const [shouldFollowClient, setShouldFollowClient] = useState(false);

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
    setIsClientReady(false);
    setShowStartButton(true);
    setShouldFollowClient(false);
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
      if (shouldFollowClient) {
        camera.center = clientPosition || position;
      } else {
        camera.center = position;
      }
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };

  const edgePaddingValue = 50;

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

  const handleStartNavigate = () => {
    setIsClientReady(true);
    setShowStartButton(false);
    setShouldFollowClient(true);

    if (clientPosition) {
      moveTo(clientPosition);
    }
  };

  useEffect(() => {
    if (origin && destination) {
      fetchAlternativeRoute();
    }
  }, [origin, destination]);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: LOCATION_DISTANCE_THRESSHOLD,
        },
        async (location) => {
          const { coords } = location;
          const { latitude, longitude } = coords;

          setClientPosition({ latitude, longitude });
          setInitialPosition({ ...initialPosition, latitude, longitude });

          try {
            const address = await Location.reverseGeocodeAsync({
              latitude,
              longitude,
            });

            if (address && address.length > 0) {
              const firstAddress = address[0];
              const street = firstAddress.street || '';

              setCurenAdress(street);
            }
          } catch (error) {
            console.error('Error getting address:', error);
          }
        },
      );
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (origin && destination && alternativeRoute) {
      setTimeout(() => {
        setRenderMainRoute(true);
      }, 1000);
    }
  }, [origin, destination, alternativeRoute]);

  useEffect(() => {
    if (clientPosition && shouldFollowClient) {
      moveTo(clientPosition);
    }
  }, [clientPosition, shouldFollowClient]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialPosition}
      >
        {origin && (
          <Marker coordinate={origin}>
            <CustomMarker />
          </Marker>
        )}

        {destination && (
          <Marker coordinate={destination}>
            <CustomMarker />
          </Marker>
        )}

        {mainPolyMarker && (
          <RouteInfoMarker
            position={mainPolyMarker}
            routeDuration={duration}
            routeDistance={distance}
            isActive
          />
        )}

        {alterPolyMarker && (
          <RouteInfoMarker
            position={alterPolyMarker}
            routeDuration={alterDistance}
            routeDistance={alterDuration}
            isActive={false}
          />
        )}

        {alterPolyMarker && (
          <RouteInfoMarker
            position={alterPolyMarker}
            routeDuration={alterDistance}
            routeDistance={alterDuration}
          />
        )}

        {clientPosition && isClientReady && (
          <Marker coordinate={clientPosition}>
            <ClientMarker />
          </Marker>
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

            {/* Client route */}
            {isClientReady && origin && destination && (
              <MapViewDirections
                origin={clientPosition || INITIAL_POSITION}
                destination={origin}
                apikey={GOOGLE_API_KEY}
                strokeColor="#B1ABF2"
                strokeWidth={4}
                // optimizeWaypoints={true} !!!! to avoid google billing I put this option to the default value (false)
              />
            )}

            {/* Main route */}
            {renderMainRoute && origin && destination && (
              <MapViewDirections
                origin={origin}
                destination={destination}
                apikey={GOOGLE_API_KEY}
                strokeColor="#665cd1"
                strokeWidth={4}
                onReady={(args) => traceRouteOnReady(args, 'main', 4)}
                // optimizeWaypoints={true} !!!! to avoid google billing I put this option to default value (false)
              />
            )}
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

          {destination && origin && (
            <TouchableOpacity style={styles.button} onPress={traceRoute}>
              <Text style={styles.buttonText}>Побудувати маршрут</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <>
        {distance && duration ? (
          <RouteInformation
            originPlace={originPlace}
            destinationPlace={destinationPlace}
            distance={distance}
            duration={duration}
            onResetInputValues={handleResetInputValuesAll}
          />
        ) : null}

        {isClientReady ? (
          <TripCheking
            originPlace={originPlace}
            curentAdress={curentAdress}
            onResetInputValues={handleResetInputValuesAll}
          />
        ) : null}

        {showStartButton && distance && duration ? (
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartNavigate}
          >
            <Text style={styles.startButtonText}>Обрати маршрут</Text>
          </TouchableOpacity>
        ) : null}
      </>
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
  startButton: {
    position: 'absolute',
    bottom: 116,
    alignSelf: 'center',
    width: 167,
    height: 36,
    backgroundColor: '#0F0F0F',
    paddingBottom: 3,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#665CD1',
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
