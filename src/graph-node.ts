import { IAttrHandler, createComponent } from './component.fp';

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
    <slot name="name">Node</slot>
  </div>
`;

const handleName: IAttrHandler = (self: HTMLElement, shadowRoot: ShadowRoot) => {
  shadowRoot.querySelector('slot[name="title"]').textContent = self.getAttribute('name');
};

createComponent({
  componentName: 'graph-node',
  template: dom,
  css: style,
  attrHandlers: {
    title: handleName,
  },
});
