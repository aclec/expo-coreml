import {Button, StyleSheet, Text, View} from 'react-native';

import * as ExpoCoreml from 'expo-coreml';
import * as FileSystem from "expo-file-system"

export default function App() {

  const downLoadModel = async () => {
    const info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'modelBrut.mlmodel');
    if(info.exists) await FileSystem.deleteAsync(FileSystem.documentDirectory + 'modelBrut.mlmodel');
    console.log("Start Download");
    try {
      await FileSystem.createDownloadResumable(
          'http://localhost:3000/modelCheh.mlmodel',
          FileSystem.documentDirectory + 'modelBrut.mlmodel',
          {}
      ).downloadAsync();
      console.log( await FileSystem.readDirectoryAsync(FileSystem.documentDirectory as string))
    }catch (e) {
      console.log(e)
    }
    console.log("End Download");
  }

  const compileModel = async () => {
    console.log("Start Compile");
    const url = await ExpoCoreml.compileModel(FileSystem.documentDirectory + 'modelBrut.mlmodel');
    if(!!url){
      const info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'modelBrut.mlmodelc');
      if(info.exists) await FileSystem.deleteAsync(FileSystem.documentDirectory + 'modelBrut.mlmodelc');
      await FileSystem.copyAsync({from: url, to: FileSystem.documentDirectory + 'modelBrut.mlmodelc'});
      await FileSystem.deleteAsync(url);
      console.log( await FileSystem.readDirectoryAsync(FileSystem.documentDirectory as string))
    }
    console.log("End Compile");
  }



  return (
    <View style={styles.container}>
      <Text>{ExpoCoreml.hello()}</Text>
      <Button title={"Download Model"} onPress={downLoadModel}/>
      <Button title={"Compile"} onPress={compileModel}/>
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
