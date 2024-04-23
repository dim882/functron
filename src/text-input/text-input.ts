import { IAttrHandler, ITemplateParams, createComponent } from '../component.fp.js';

const css = `
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

const template = (values: ITemplateParams) => {
  return `
    <div>
      <label><slot name="label"></slot></label>
      <div><input type="text" name="${values.fieldname}" value="${values.value}"></div>
      <p class='my-message'><slot name="message"></slot></p>
    </div>
  `;
};

const defaultHandler: IAttrHandler = ({ value }) => (value ? value : '');

const MyComponent = createComponent({
  template,
  css,
  shadowDomSettings: { mode: 'open' },
  attrHandlers: {
    fieldname: defaultHandler,
    value: defaultHandler,
  },
});

customElements.define('ui-text-input', MyComponent);
