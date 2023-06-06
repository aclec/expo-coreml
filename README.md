# expo-coreml

- Use Hermes Engine
- Create custom expo dev build to use in development
- Only Object Detection (VNRecognizedObjectObservation) for the moment


## Installation

```js
yarn add expo-coreml
npm install expo-coreml
```


## Usage

```js
import * as ExpoCoreml from 'expo-coreml';
import * as FileSystem from "expo-file-system";
import * as ImagePicker from 'expo-image-picker';

export default function MyCompnent(){

    const compileModel = async () => {
        const compiledUrl = await ExpoCoreml.compileModel("fileURI of .mlmodel");
        if(!!url){
            await FileSystem.copyAsync({from: url, to: FileSystem.documentDirectory + 'myCompiledModel.mlmodelc'});
            await FileSystem.deleteAsync(url);
        }
    }

    const handlePredict = async () => {

        const images = await ImagePicker.launchImageLibraryAsync({
            quality: 1
        });
        if(!!images.assets){
            for (const image of images.assets){
                // console.log(image.uri)
                const res = await ExpoCoreml.predict(
                    FileSystem.documentDirectory + 'myCompiledModel.mlmodelc',
                    image.uri,
                );

                const refactorSize = res.map(item => {
                    return {
                        ...item,
                        boundingBox: {
                            x: item?.boundingBox?.x * image.width,
                            y: (1 - (item?.boundingBox?.y + item?.boundingBox?.height)) * img.height,
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
        <View/>
    );
}
```
