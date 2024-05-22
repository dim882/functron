import { createComponent, jsx } from '../../lib/ComponentFactory';

const MyComponent = createComponent({
  tagName: 'ui-form',
  cssPath: './form.css',
  render: (model) => (
    <form>
      <ui-text-input attrs={{ fieldname: 'firstname' }}></ui-text-input>
      <hello-vdom foo="bar"></hello-vdom>
    </form>
  ),
});

customElements.define('ui-form', MyComponent);
