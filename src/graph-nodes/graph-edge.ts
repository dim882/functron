import { IAttrHandler, createComponent } from '../component.fp.js';

const css = `
:host {
}
`;

const template = `
  <svg width="50" height="20">
    <path d="M10 10 C 20 20, 40 20, 50 10" stroke="black" fill="transparent"/>
  </svg>
`;

const GraphNode = createComponent({
  template,
  css,
  attrHandlers: {},
});

customElements.define('graph-edge', GraphNode);
