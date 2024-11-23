import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Routinas from './components/rutinas';

export default function App() {
  return (
    <View style={styles.container}>
      <Routinas />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#90E0EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
