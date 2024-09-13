import { createComponent, jsx } from '../../lib/ComponentFactory';

const MyComponent = createComponent({
  tagName: 'ui-form',
  cssPath: './form.css',
  initialModel: {},
  render: () => (
    <form>
      <slot></slot>
    </form>
  ),
});

customElements.define('ui-form', MyComponent);
