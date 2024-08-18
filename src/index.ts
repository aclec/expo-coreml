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

export interface ClassifyObject{
  confidence: number,
  label: string,
}

// Get the native constant value.
export function hello(): string {
  return ExpoCoremlModule.hello();
}

export async function compileModel(url: string, destUrl: string) {
  return await ExpoCoremlModule.compileModel(url, destUrl);
}

export async function predict(modelURL: string, imageURL: string): Promise<RecognizedObject[]> {
  return await ExpoCoremlModule.predict(modelURL, imageURL);
}

export async function classify(modelURL: string, imageURL: string): Promise<ClassifyObject[]> {
  return await ExpoCoremlModule.classify(modelURL, imageURL);
}