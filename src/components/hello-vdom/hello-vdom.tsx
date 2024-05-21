import { jsx, Fragment, VNode } from 'snabbdom';
import { createDecoratedComponent } from '../../lib/createComponent.decorated';
import { h } from '../../lib/snabbdomHelper';

const vNode: VNode = (
  <form>
    <ui-text-input attrs={{ fieldname: 'firstname', value: 'Joseph Schmoe' }}>
      <div slot="label">Custom Label</div>
      <div slot="message">Do something!</div>
    </ui-text-input>
    foo
    <ui-text-input attrs={{ fieldname: 'firstname', value: 'Joseph Schmoe' }}></ui-text-input>
  </form>
);

const SnabbdomComponent = createDecoratedComponent({
  css: '.myClass { color: red; }',
  render: (model) => (
    <div class={{ myClass: true }}>
      This is JSX <div>foo</div>
      <span>bar</span>
    </div>
  ),
});

customElements.define('hello-vdom', SnabbdomComponent);
