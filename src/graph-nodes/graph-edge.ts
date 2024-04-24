import { IAttrHandler, createComponent } from '../component.fp.js';

const css = `
:host {
  position: absolute;
}

:host svg {
  display: inline;
}
`;

const template = (element: typeof GraphNode) => {
  console.log(element);

  const path = `
    M 0 10 
    l 50 0
  `;

  return `
    <svg viewBox="0 0 50 20" width="50" height="20">
      <path d="${path}" stroke="black" fill="transparent"/>
    </svg>
    `;
};

const GraphNode = createComponent({
  render: template,
  css,
  attrHandlers: {},
});

customElements.define('graph-edge', GraphNode);
