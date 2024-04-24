import { IAttrHandler, createComponent } from '../component.fp.js';

const css = `
:host {
  display: inline;
  border: 1px solid black;
  padding: 10px;
  font-family: sans-serif;
  border-radius: 5px;
}
`;

const template = `
  <slot></slot>
`;

const GraphNode = createComponent({
  render: template,
  css,
  attrHandlers: {},
});

customElements.define('graph-node', GraphNode);
