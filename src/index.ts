import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoCoreml.web.ts
// and on native platforms to ExpoCoreml.ts
import ExpoCoremlModule from './ExpoCoremlModule';
import ExpoCoremlView from './ExpoCoremlView';
import { ChangeEventPayload, ExpoCoremlViewProps } from './ExpoCoreml.types';

// Get the native constant value.
export const PI = ExpoCoremlModule.PI;

export function hello(): string {
  return ExpoCoremlModule.hello();
}

export async function setValueAsync(value: string) {
  return await ExpoCoremlModule.setValueAsync(value);
}

const emitter = new EventEmitter(ExpoCoremlModule ?? NativeModulesProxy.ExpoCoreml);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ExpoCoremlView, ExpoCoremlViewProps, ChangeEventPayload };
