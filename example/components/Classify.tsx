import {Button, Text, View} from 'react-native';
import * as ExpoCoreml from 'expo-coreml';
import * as FileSystem from "expo-file-system";
import * as ImagePicker from 'expo-image-picker';
import Constants from "expo-constants";

export default function Classify() {

    const clear = async () => {
        let info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'modelClassify.mlmodel');
        if(info.exists) await FileSystem.deleteAsync(FileSystem.documentDirectory + 'modelClassify.mlmodel');
        info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'modelClassify.mlmodelc');
        if(info.exists) await FileSystem.deleteAsync(FileSystem.documentDirectory + 'modelClassify.mlmodelc');
        console.log( await FileSystem.readDirectoryAsync(FileSystem.documentDirectory as string))
    }

    const downLoadModel = async () => {
        const info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'modelClassify.mlmodel');
        if(info.exists) await FileSystem.deleteAsync(FileSystem.documentDirectory + 'modelClassify.mlmodel');
        console.log("Start Download Classify");
        try {
            console.log(`http:${Constants.expoGoConfig?.logUrl?.split(":")?.[1]}:3000/modelClassify.mlmodel`)
            await FileSystem.createDownloadResumable(
                `http:${Constants.expoGoConfig?.logUrl?.split(":")?.[1]}:3000/modelClassify.mlmodel`,
                FileSystem.documentDirectory + 'modelClassify.mlmodel',
                {}
            ).downloadAsync();
            console.log( await FileSystem.readDirectoryAsync(FileSystem.documentDirectory as string))
        }catch (e) {
            console.log(e)
        }
        console.log("End Download Classify");
    }

    const compileModel = async () => {
        console.log("Start Compile Classify");
        const url = await ExpoCoreml.compileModel(FileSystem.documentDirectory + 'modelClassify.mlmodel');
        if(!!url){
            const info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'modelClassify.mlmodelc');
            if(info.exists) await FileSystem.deleteAsync(FileSystem.documentDirectory + 'modelClassify.mlmodelc');
            await FileSystem.copyAsync({from: url, to: FileSystem.documentDirectory + 'modelClassify.mlmodelc'});
            await FileSystem.deleteAsync(url);
            console.log( await FileSystem.readDirectoryAsync(FileSystem.documentDirectory as string))
        }
        console.log("End Compile Classify");
    }


    const handleClassify = async () => {

        const images = await ImagePicker.launchImageLibraryAsync({
            quality: 1
        });
        if(!!images.assets){
            for (const image of images.assets){
                // console.log(image.uri)
                const res = await ExpoCoreml.classify(
                    FileSystem.documentDirectory + 'modelClassify.mlmodelc',
                    image.uri,
                );

                console.log(res);

            }
        }
    }


    return (
        <View style={{display: "flex", alignItems: "center", borderBottomWidth: 1, marginBottom: 10}}>
            <Text style={{fontSize: 20}}>Classify</Text>
            <Button title={"Clear"} onPress={clear} color={"red"}/>
            <Button title={"Download Model"} onPress={downLoadModel}/>
            <Button title={"Compile"} onPress={compileModel}/>
            <Button title={"Classify"} onPress={handleClassify}/>
        </View>
    );
}
