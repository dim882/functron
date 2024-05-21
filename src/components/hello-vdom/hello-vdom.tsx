import { createDecoratedComponent } from '../../lib/createComponent.decorated';
import { h, jsx } from '../../lib/snabbdomHelper';

const SnabbdomComponent = createDecoratedComponent({
  css: '.myClass { color: red; }',
  render: (model) => <div class={{ myClass: true }}>This is JSX</div>,
});

customElements.define('hello-vdom', SnabbdomComponent);
