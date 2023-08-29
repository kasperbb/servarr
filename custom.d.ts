declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
  const content: React.FunctionComponent<React.SVGProps<SVGElement>>;
  export default content;
}
