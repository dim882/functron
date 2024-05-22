import { jsx, Fragment, VNode } from 'snabbdom';
import { createDecoratedComponent } from '../../lib/createComponent.decorated';
import { createComponent } from '../../lib/createComponent.base';
import { h } from '../../lib/snabbdomHelper';

interface IHelloModel {
  foo: string;
}
const SnabbdomComponent = createComponent<['foo'], IHelloModel>({
  // css: '.myClass { color: red; }',
  attributes: ['foo'],
  shadowDomSettings: {
    mode: 'open',
  },
  mapAttributesToModel(attributes, model) {
    return {
      ...model,
      foo: attributes.foo,
    };
  },
  render: (model) => {
    return (
      <div class={{ myClass: true }}>
        This is JSX
        <div>{model?.foo}</div>
      </div>
    );
  },
});

customElements.define('hello-vdom', SnabbdomComponent);
