import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function Messages() {
  return (
    <View style={styles.container}>
      <Text style={{ color: 'black' }}>Messages</Text>
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
