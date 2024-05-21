import { jsx, Fragment, VNode } from 'snabbdom';
import { createDecoratedComponent } from '../../lib/createComponent.decorated';
import { h } from '../../lib/snabbdomHelper';

const SnabbdomComponent = createDecoratedComponent({
  css: '.myClass { color: red; }',
  attributes: ['foo'],
  mapAttributesToState(attributes, state) {
    return {
      ...state,
      foo: attributes.foo,
    };
  },
  render: (model) => {
    console.log({ model });

    return (
      <div class={{ myClass: true }}>
        This is JSX
        <div>{model?.foo}</div>
      </div>
    );
  },
});

customElements.define('hello-vdom', SnabbdomComponent);
