import { jsx } from 'snabbdom';
import { createComponent } from '../../lib/createComponent.base';
import { h } from '../../lib/snabbdomHelper';

interface IHelloModel {
  foo: string;
}
const SnabbdomComponent = createComponent<['foo'], IHelloModel>({
  tagName: 'hello-vdom',
  css: '.myClass { color: red; }',
  attributes: ['foo'],
  shadowDomSettings: {
    mode: 'closed',
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
