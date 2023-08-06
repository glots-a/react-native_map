import React from 'react';
import { ImageBackground, Text, StyleSheet, Dimensions } from 'react-native';

export default function Settings() {
  return (
    <ImageBackground
      source={require('../assets/img/kozak2.jpg')}
      style={styles.container}
    >
      <Text style={styles.text}>Слава Україні</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'yellow',
    fontSize: 32,
  },
});
