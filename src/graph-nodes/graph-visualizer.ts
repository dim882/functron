import { IAttrHandler, createComponent } from '../component.fp.js';

const css = `
:host {
  position: relative;
  display: block;
  padding: 10px;
  font-family: sans-serif;
}

div {
  display: flex;
  gap: 40px;
}
`;

const template = `
  <div>
    <slot></slot>
  </div>
`;

const GraphNode = createComponent({
  template,
  css,
  attrHandlers: {},
});

customElements.define('graph-visualizer', GraphNode);
