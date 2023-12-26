import {StyleSheet, View} from 'react-native';
import Prediction from "./components/Prediction";
import Classify from "./components/Classify";

export default function App() {

  return (
    <View style={styles.container}>
      <Prediction/>
      <Classify/>
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
