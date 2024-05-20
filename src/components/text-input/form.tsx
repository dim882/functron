import { jsx, Fragment, VNode } from 'snabbdom';
import { createDecoratedComponent } from '../../lib/createComponent.decorated';
import { h } from '../../lib/snabbdomHelper';

const vNode: VNode = (
  <form>
    <div>
      foo!<div>baz</div>
    </div>
    bar
  </form>
);
console.log('Transformed VNode:', vNode);

const MyComponent = createDecoratedComponent({
  cssPath: './form.css',
  render: (state) => (
    <form>
      <div>
        foo!<div>baz</div>
      </div>
      bar
    </form>
  ),
});

customElements.define('ui-form', MyComponent);
