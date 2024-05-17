import { createDecoratedComponent } from '../../lib/createComponent.decorated';
import { h } from '../../lib/snabbdomHelper';

const SnabbdomComponent = createDecoratedComponent({
  css: '.myClass { color: red; }',
  render: (model) => <div class={{ myClass: true }}>Hello Snabbdom</div>,
});

customElements.define('hello-vdom', SnabbdomComponent);
