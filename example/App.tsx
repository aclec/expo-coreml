import { StyleSheet, Text, View } from 'react-native';

import * as ExpoCoreml from 'expo-coreml';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ExpoCoreml.hello()}</Text>
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
});
