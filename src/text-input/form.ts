import { IAttrHandler, ITemplateParams, createComponent } from '../component.fp.js';

const template = (values: ITemplateParams) => {
  return `
    <form>
      <slot></slot>
    </form>
  `;
};

const defaultHandler: IAttrHandler = ({ value }) => (value ? value : '');

const MyComponent = createComponent({
  template,
  cssPath: './form.css',
  attrHandlers: {
    fieldname: defaultHandler,
    value: defaultHandler,
  },
});

customElements.define('ui-form', MyComponent);
