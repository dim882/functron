import { IAttrHandler, ITemplateParams, createComponent } from '../component.fp.js';

const MyComponent = createComponent({
  cssPath: './form.css',
  template: (values: ITemplateParams) => {
    return `
      <form>
        <slot></slot>
      </form>
    `;
  },
});

customElements.define('ui-form', MyComponent);
