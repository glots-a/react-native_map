import React from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';

export default function Settings() {
  return <Text style={styles.text}>Settings</Text>;
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
    color: 'black',
    fontSize: 32,
  },
});
