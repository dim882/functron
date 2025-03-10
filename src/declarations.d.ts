import { VNode, VNodeData } from 'snabbdom';

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: VNodeData;
      button: VNodeData;
      form: VNodeData;
      slot: VNodeData;
      span: VNodeData;
      label: VNodeData;
      input: VNodeData;
    }
  }
}
