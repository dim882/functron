import { jsx, Fragment, VNode } from 'snabbdom';
import { createComponent } from '../../lib/createComponent.base';
import { h } from '../../lib/snabbdomHelper';

const MyComponent = createComponent({
  tagName: 'ui-form',
  cssPath: './form.css',
  render: (state) => (
    <form>
      <ui-text-input attrs={{ fieldname: 'firstname' }}></ui-text-input>
      <hello-vdom foo="bar"></hello-vdom>
    </form>
  ),
});

customElements.define('ui-form', MyComponent);
