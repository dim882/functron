import { IAttrHandler, createComponent } from '../component.fp.js';

const MyComponent = createComponent<{ fieldname: string; value: string }>({
  cssPath: './text-input.css',
  attributes: ['fieldname', 'value'],
  template: (values) => {
    return `
      <div>
        <label><slot name="label"></slot></label>
        <div><input type="text" name="${values.fieldname}" value="${values.value}"></div>
        <p class='my-message'><slot name="message"></slot></p>
      </div>
    `;
  },
});

customElements.define('ui-text-input', MyComponent);
