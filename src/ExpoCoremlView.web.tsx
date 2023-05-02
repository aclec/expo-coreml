import * as React from 'react';

import { ExpoCoremlViewProps } from './ExpoCoreml.types';

export default function ExpoCoremlView(props: ExpoCoremlViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
