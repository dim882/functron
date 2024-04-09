import { IAttrHandler, createComponent } from '../component.fp.js';

const css = `
:host {
}
`;

const template = `
  <div>---</div>
`;

const GraphNode = createComponent({
  template,
  css,
  attrHandlers: {},
});

customElements.define('graph-edge', GraphNode);
