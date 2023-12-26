import {Button, Text, View} from 'react-native';
import * as ExpoCoreml from 'expo-coreml';
import * as FileSystem from "expo-file-system";
import * as ImagePicker from 'expo-image-picker';

export default function Prediction() {

    const clear = async () => {
        let info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'modelPrediction.mlmodel');
        if(info.exists) await FileSystem.deleteAsync(FileSystem.documentDirectory + 'modelPrediction.mlmodel');
        info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'modelPrediction.mlmodelc');
        if(info.exists) await FileSystem.deleteAsync(FileSystem.documentDirectory + 'modelPrediction.mlmodelc');
        console.log( await FileSystem.readDirectoryAsync(FileSystem.documentDirectory as string))
    }

    const downLoadModel = async () => {
        const info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'modelPrediction.mlmodel');
        if(info.exists) await FileSystem.deleteAsync(FileSystem.documentDirectory + 'modelPrediction.mlmodel');
        console.log("Start Download Predictions");
        try {
            await FileSystem.createDownloadResumable(
                'http://localhost:3000/modelPrediction.mlmodel',
                FileSystem.documentDirectory + 'modelPrediction.mlmodel',
                {}
            ).downloadAsync();
            console.log( await FileSystem.readDirectoryAsync(FileSystem.documentDirectory as string))
        }catch (e) {
            console.log(e)
        }
        console.log("End Download Predictions");
    }

    const compileModel = async () => {
        console.log("Start Compile Predictions");
        const url = await ExpoCoreml.compileModel(FileSystem.documentDirectory + 'modelPrediction.mlmodel');
        if(!!url){
            const info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'modelPrediction.mlmodelc');
            if(info.exists) await FileSystem.deleteAsync(FileSystem.documentDirectory + 'modelPrediction.mlmodelc');
            await FileSystem.copyAsync({from: url, to: FileSystem.documentDirectory + 'modelPrediction.mlmodelc'});
            await FileSystem.deleteAsync(url);
            console.log( await FileSystem.readDirectoryAsync(FileSystem.documentDirectory as string))
        }
        console.log("End Compile Predictions");
    }


    const handlePredict = async () => {

        const images = await ImagePicker.launchImageLibraryAsync({
            quality: 1
        });
        if(!!images.assets){
            for (const image of images.assets){
                // console.log(image.uri)
                const res = await ExpoCoreml.predict(
                    FileSystem.documentDirectory + 'modelPrediction.mlmodelc',
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
        <View style={{display: "flex", alignItems: "center", borderBottomWidth: 1, marginBottom: 10}}>
            <Text style={{fontSize: 20}}>Prediction</Text>
            <Button title={"Clear"} onPress={clear} color={"red"}/>
            <Button title={"Download Model"} onPress={downLoadModel}/>
            <Button title={"Compile"} onPress={compileModel}/>
            <Button title={"Predict"} onPress={handlePredict}/>
        </View>
    );
}
