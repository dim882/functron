import { createComponent, jsx } from '../../lib/ComponentFactory';

const MyComponent = createComponent({
  cssPath: './form.css',
  initialModel: {},
  render: () => (
    <form>
      <slot></slot>
    </form>
  ),
});

customElements.define('ui-form', MyComponent);
