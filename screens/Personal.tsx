import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function Personal() {
  return (
    <View style={styles.container}>
      <Text style={{ color: 'black' }}>Personal</Text>
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
