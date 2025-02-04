import { VNode } from 'snabbdom';

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: any;
      button: any;
      form: any;
      slot: any;
      span: any;
      label: any;
      input: any;
    }
  }
}
