/** @jsx h */
import { jsx, Fragment } from 'snabbdom';
import { createDecoratedComponent } from '../../lib/createComponent.decorated';
import { h } from '../../lib/snabbdomHelper';

const MyComponent = createDecoratedComponent({
  cssPath: './form.css',
  render: (state) => (
    <form>
      <div>foo</div>
      bar
    </form>
  ),
});

customElements.define('ui-form', MyComponent);
