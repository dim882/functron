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

const dom = `
  <div>
    <input type="text" name="first_name"/>
    <br/>
    <slot name="title">Default Title</slot>
    <p><slot name="children">Default content.</slot></p>
  </div>
`;

const handleName: IAttrHandler = (self: HTMLElement, shadowRoot: ShadowRoot) => {
  shadowRoot.querySelector('slot[name="title"]').textContent = self.getAttribute('name');
};

const MyComponent = createComponent({
  template: dom,
  css: style,
  attrHandlers: {
    title: handleName,
  },
});

customElements.define('my-component', MyComponent);
