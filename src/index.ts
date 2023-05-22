// Import the native module. On web, it will be resolved to ExpoCoreml.web.ts
// and on native platforms to ExpoCoreml.ts
import ExpoCoremlModule from './ExpoCoremlModule';

// Get the native constant value.
export function hello(): string {
  return ExpoCoremlModule.hello();
}

export async function compileModel(url: string) {
  return await ExpoCoremlModule.compileModel(url);
}

export async function predict(urlModel: string, urlFile: string) {
  return await ExpoCoremlModule.predict(urlModel, urlFile);
}