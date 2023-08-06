import { TouchableOpacity, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import styled from 'styled-components/native';
import Constants from 'expo-constants';

interface Place {
  country: string;
  city: string;
  street: string;
}

type Props = {
  originPlace: Place | null;
  onResetInputValues: () => void;
  curentAdress: string;
};

export default function TripCheking({
  originPlace,
  onResetInputValues,
  curentAdress,
}: Props) {
  return (
    <Container>
      <ContentContainer>
        <Title>Маршрут до точки загрузки</Title>
        <RouteInfo>
          <CarImage source={require('../assets/img/position-markers.png')} />
          <AdressDetails>
            <GridViev>
              {originPlace && (
                <MeshContainer>
                  <AdressCountry>Поточна точка знаходження</AdressCountry>
                  <StreeAdress>{curentAdress}</StreeAdress>
                </MeshContainer>
              )}
            </GridViev>

            <GridViev style={{ marginTop: 3 }}>
              {originPlace && (
                <MeshContainer>
                  <AdressCountry>{`${originPlace.country}, ${originPlace.city}`}</AdressCountry>
                  <StreeAdress>{originPlace.street}</StreeAdress>
                </MeshContainer>
              )}
              {originPlace && (
                <MeshContainer>
                  <DateText>Потрібний час прибуття</DateText>
                  <TimeText>12:00</TimeText>
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
  margin-bottom: 20px;
`;

const RouteInfo = styled.View`
  flex-direction: row;
  box-sizing: border-box;
`;

const CarImage = styled.Image`
  width: 16px;
  height: 62px;
  margin-left: 18px;
  margin-top: 10px;
`;

const AdressDetails = styled.View`
  flex: 1;
  margin-left: 12px;
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
  margin-right: 20px;
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
  text-align: right;
  margin-right: 20px;
`;
