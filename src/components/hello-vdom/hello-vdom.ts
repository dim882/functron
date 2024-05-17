import { createDecoratedComponent } from '../../lib/createComponent.decorated';
import { h } from '../../lib/snabbdomHelper';

const MyComponent = createDecoratedComponent({
  render: (model) => h('div', { class: { myClass: true } }, 'Hello Snabbdom'),
  css: '.myClass { color: red; }',
});

customElements.define('hello-vdom', MyComponent);
