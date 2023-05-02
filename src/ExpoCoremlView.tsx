import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoCoremlViewProps } from './ExpoCoreml.types';

const NativeView: React.ComponentType<ExpoCoremlViewProps> =
  requireNativeViewManager('ExpoCoreml');

export default function ExpoCoremlView(props: ExpoCoremlViewProps) {
  return <NativeView {...props} />;
}
