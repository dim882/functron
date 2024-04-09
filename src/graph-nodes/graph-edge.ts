import { IAttrHandler, createComponent } from '../component.fp.js';

const css = `
:host {

}

:host svg {
}
`;

const template = (element: typeof GraphNode) => {
  console.log(element);

  const path = `
    M0 10 
    l 100 0
  `;

  return `
    <svg width="50" height="20">
      <path d="${path}" stroke="black" fill="transparent"/>
    </svg>
    `;
};

const GraphNode = createComponent({
  template,
  css,
  attrHandlers: {},
});

customElements.define('graph-edge', GraphNode);
