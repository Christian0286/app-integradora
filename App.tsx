import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RoutineListScreen from './pantallas/rutinas'

export default function App() {
  return (
    <View style={styles.container}>
      <RoutineListScreen/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:10,
    marginTop:10,
  },
});
