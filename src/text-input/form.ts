import { createComponent } from '../component.fp.js';

const MyComponent = createComponent({
  cssPath: './form.css',
  template: (state) => {
    return `
      <form>
        <slot></slot>
      </form>
    `;
  },
});

customElements.define('ui-form', MyComponent);
