import { createComponent, jsx } from '../../lib/ComponentFactory';

const MyComponent = createComponent({
  tagName: 'ui-form',
  cssPath: './form.css',
  initialModel: {},
  render: () => (
    <form>
      <ui-text-input attrs={{ fieldname: 'firstname' }}></ui-text-input>
      <slot></slot>
    </form>
  ),
});

customElements.define('ui-form', MyComponent);
