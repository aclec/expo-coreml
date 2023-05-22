// Import the native module. On web, it will be resolved to ExpoCoreml.web.ts
// and on native platforms to ExpoCoreml.ts
import ExpoCoremlModule from './ExpoCoremlModule';

export interface RecognizedObject{
  confidence: number,
  label: string,
  boundingBox: {
    x: number,
    y: number,
    width: number,
    height: number
  }
}

// Get the native constant value.
export function hello(): string {
  return ExpoCoremlModule.hello();
}

export async function compileModel(url: string) {
  return await ExpoCoremlModule.compileModel(url);
}

export async function predict(modelURL: string, imageURL: string): Promise<RecognizedObject[]> {
  return await ExpoCoremlModule.predict(modelURL, imageURL);
}