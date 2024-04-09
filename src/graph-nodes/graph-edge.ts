import { IAttrHandler, createComponent } from '../component.fp.js';

const css = `
:host {

}

:host svg {
  border: 1px solid;
}
`;

const template = () => {
  const path = `
    M0 10 C 20 20, 
    40 20, 
    50 10
  `;

  return `
    <svg width="50" height="20">
      <path d="${path}" stroke="black" fill="transparent"/>
    </svg>
    `;
};

interface ITemplateArgs {}

const GraphNode = createComponent<ITemplateArgs>({
  template,
  css,
  attrHandlers: {},
});

customElements.define('graph-edge', GraphNode);
