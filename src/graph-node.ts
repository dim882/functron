import { IAttrHandler, createComponent } from './component.fp';

const css = `
:host {
  display: block;
  border: 2px solid black;
  padding: 10px;
  font-family: sans-serif;
}
`;

const template = `
  <div>
    <slot name="name">Node</slot>
  </div>
`;

createComponent({
  componentName: 'graph-node',
  template,
  css,
  attrHandlers: {},
});
