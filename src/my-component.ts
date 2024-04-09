import { IAttrHandler, createComponent } from './component.fp.js';

const style = `
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

const template = `
  <div>
    <slot name="title">Default Title</slot>
    <p><slot name="children">Default content.</slot></p>
    <div><input type="text" name="first_name"/></div>
  </div>
`;

const handleTitle: IAttrHandler = ({ shadowRoot, value }) => {
  shadowRoot.querySelector('slot[name="title"]').textContent = value;
};

const MyComponent = createComponent({
  template,
  css: style,
  attrHandlers: {
    title: handleTitle,
  },
});

customElements.define('my-component', MyComponent);
