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
      <div><input type="text" name="first_name" value="${values.firstname}"></div>
      <p><slot name="message"></slot></p>
    </div>
  `;
};

const handleTitle: IAttrHandler = ({ value }) => (value ? value : '');
const handleFirstName: IAttrHandler = ({ value }) => (value ? value : '');

const MyComponent = createComponent({
  template,
  css,
  attrHandlers: {
    title: handleTitle,
    firstname: handleFirstName,
  },
});

customElements.define('ui-text-input', MyComponent);
