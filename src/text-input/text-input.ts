import { createComponent } from '../component.fp.js';

const MyComponent = createComponent<['fieldname', 'value'], { name: string; value: string }>({
  cssPath: './text-input.css',
  attributes: ['fieldname', 'value'],
  template: (state) => {
    return `
      <div>
        <label><slot name="label"></slot></label>
        <div><input type="text" name="${state.name}" value="${state.value}"></div>
        <p class='my-message'><slot name="message"></slot></p>
      </div>
    `;
  },
});

customElements.define('ui-text-input', MyComponent);
