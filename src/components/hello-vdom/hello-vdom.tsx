/** @jsx h */
import { createDecoratedComponent } from '../../lib/createComponent.decorated';
import { h } from '../../lib/snabbdomHelper';

const SnabbdomComponent = createDecoratedComponent({
  shadowDomSettings: { mode: 'open' },
  render: (model) => <div class={{ myClass: true }}>Hello Snabbdom</div>,
  css: '.myClass { color: red; }',
});

customElements.define('hello-vdom', SnabbdomComponent);
