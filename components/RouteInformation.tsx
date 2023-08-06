import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { LatLng } from 'react-native-maps';

import styled from 'styled-components/native';
import Constants from 'expo-constants';

interface Place {
  country: string;
  city: string;
  street: string;
}

type Props = {
  distance: number;
  duration: number;
  originPlace: Place | null;
  destinationPlace: Place | null;
  onResetInputValues: () => void;
};

export default function RouteInformation({
  distance,
  duration,
  originPlace,
  destinationPlace,
  onResetInputValues,
}: Props) {
  const [date, setDate] = useState<Date>();
  const [destination, setDestination] = useState<Date>();

  const formatDate = (date: Date): string => {
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // Months are zero-based
    const year = date.getUTCFullYear();

    return `${day.toString().padStart(2, '0')}.${month
      .toString()
      .padStart(2, '0')}.${year}`;
  };

  const formatTime = (date: Date): string => {
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  };

  useEffect(() => {
    const currentDate = new Date();
    setDate(currentDate);

    if (duration && currentDate) {
      const durationInMilliseconds = duration * 60000;
      const destinationTime = currentDate.getTime() + durationInMilliseconds;
      const destinationDate = new Date(destinationTime);
      setDestination(destinationDate);
    }
  }, [duration]);

  return (
    <Container>
      <ContentContainer>
        <Title>Ваш маршрут прокладено</Title>
        <RouteInfo>
          <CarImage source={require('../assets/img/car.png')} />
          <AdressDetails>
            <GridViev>
              {originPlace && (
                <MeshContainer>
                  <AdressCountry>{`${originPlace.country}, ${originPlace.city}`}</AdressCountry>
                  <StreeAdress>{originPlace.street}</StreeAdress>
                </MeshContainer>
              )}

              {date && (
                <MeshContainer>
                  <DateText>{formatDate(date)}</DateText>
                  <TimeText>{formatTime(date)}</TimeText>
                </MeshContainer>
              )}
            </GridViev>

            <GridViev style={{ marginTop: 3 }}>
              {destinationPlace && (
                <MeshContainer>
                  <AdressCountry>{`${destinationPlace.country}, ${destinationPlace.city}`}</AdressCountry>
                  <StreeAdress>{destinationPlace.street}</StreeAdress>
                </MeshContainer>
              )}
              {destination && (
                <MeshContainer>
                  <DateText>{formatDate(destination)}</DateText>
                  <TimeText>{formatTime(destination)}</TimeText>
                </MeshContainer>
              )}
            </GridViev>
          </AdressDetails>
        </RouteInfo>
      </ContentContainer>
      <TouchableOpacity
        onPress={onResetInputValues}
        style={{ position: 'absolute', top: 25, left: 10 }}
      >
        <AntDesign name="back" size={22} color="white" />
      </TouchableOpacity>
    </Container>
  );
}

const Container = styled.View`
  position: absolute;
  width: 100%;
  background-color: #0f0f0f;
  height: 165px;
  top: ${Constants.statusBarHeight}px;
  padding: 8px;
  border-radius: 8px;
  elevation: 4;
`;

const ContentContainer = styled.View`
  flex-direction: column;
  margin-top: 15px;
`;

const Title = styled.Text`
  color: #665cd1;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
`;

const RouteInfo = styled.View`
  flex-direction: row;
  box-sizing: border-box;
`;

const CarImage = styled.Image`
  width: 130px;
  height: 80px;
`;

const AdressDetails = styled.View`
  flex: 1;
  margin-left: 10px;
`;

const GridViev = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const AdressCountry = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: medium;
`;
const MeshContainer = styled.View`
  flex-direction: column;
`;

const DateText = styled.Text`
  color: #fff;
  font-size: 11px;
  font-weight: medium;
`;

const StreeAdress = styled.Text`
  color: #7e7e7e;
  font-size: 14px;
  font-weight: medium;
`;

const TimeText = styled.Text`
  color: #665cd1;
  font-size: 14px;
  font-weight: bold;
`;
