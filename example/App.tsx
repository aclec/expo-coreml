import {Button, StyleSheet, Text, View} from 'react-native';

import * as ExpoCoreml from 'expo-coreml';
import * as FileSystem from "expo-file-system";
import * as ImagePicker from 'expo-image-picker';

export default function App() {

  const clear = async () => {
    let info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'modelBrut.mlmodel');
    if(info.exists) await FileSystem.deleteAsync(FileSystem.documentDirectory + 'modelBrut.mlmodel');
    info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'modelBrut.mlmodelc');
    if(info.exists) await FileSystem.deleteAsync(FileSystem.documentDirectory + 'modelBrut.mlmodelc');
    console.log( await FileSystem.readDirectoryAsync(FileSystem.documentDirectory as string))
  }

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


  const handlePredict = async () => {

    const images = await ImagePicker.launchImageLibraryAsync({
      quality: 1
    });
    if(!!images.assets){
      for (const image of images.assets){
        // console.log(image.uri)
        const res = await ExpoCoreml.predict(
            FileSystem.documentDirectory + 'modelBrut.mlmodelc',
            image.uri,
        );

        const refactorSize = res.map(item => {
          return {
            ...item,
            boundingBox: {
              x: item?.boundingBox?.x * image.width,
              y: item?.boundingBox?.y * image.height,
              width: item?.boundingBox?.width * image.width,
              height: item?.boundingBox?.height * image.height
            }
          }
        });

        console.log(refactorSize);
        console.log("Totals => ", refactorSize.length);

      }
    }
  }


  return (
    <View style={styles.container}>
      <Button title={"Clear"} onPress={clear} color={"red"}/>
      <Text>{ExpoCoreml.hello()}</Text>
      <Button title={"Download Model"} onPress={downLoadModel}/>
      <Button title={"Compile"} onPress={compileModel}/>
      <Button title={"Predict"} onPress={handlePredict}/>
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
