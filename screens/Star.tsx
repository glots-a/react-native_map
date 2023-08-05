import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function Star() {
  return (
    <View style={styles.container}>
      <Text style={{ color: 'black' }}>Star</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
