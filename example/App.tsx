import {StyleSheet, View} from 'react-native';
import Prediction from "./components/Prediction";

export default function App() {

  return (
    <View style={styles.container}>
      <Prediction/>
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
