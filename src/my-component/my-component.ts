import { IAttrHandler, createComponent } from '../component.fp.js';

const css = `
:host {
  display: block;
  border: 2px solid black;
  padding: 10px;
  font-family: sans-serif;
}

:host(:hover) ::slotted(div) {
  color: red;
}
`;

const template = (component: HTMLElement) => `
  <div>
    <slot name="title">Default Title</slot>
    <p><slot name="children">Default Children</slot></p>
    <div><input type="text" name="first_name"/></div>
    <slot name="other"></slot>
  </div>
`;

const handleTitle: IAttrHandler = ({ value }) => value;

const MyComponent = createComponent({
  template,
  css,
  attrHandlers: {
    title: handleTitle,
  },
});

customElements.define('my-component', MyComponent);
