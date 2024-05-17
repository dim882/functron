import { createDecoratedComponent } from '../../lib/createComponent.decorated';
import { h } from '../../lib/snabbdomHelper';

const MyComponent = createDecoratedComponent<['fieldname', 'value'], { name: string; value: string }>({
  constructor: () => {
    console.log('text-input constructor');
  },
  cssPath: './text-input.css',
  attributes: ['fieldname', 'value'],
  mapAttributesToState(attributes, state) {
    console.log('text-input mapAttributesToState');

    return {
      ...state,
      name: attributes.fieldname,
      value: attributes.value + '!',
    };
  },
  render: (state) => {
    console.log('---text-input render');

    console.log({ state });

    return (
      <div>
        <label>
          <slot name="label"></slot>
        </label>
        <div>
          <input type="text" name="{state.name}" value="{state.value}"></input>
        </div>
        <p class="my-message">
          <slot name="message"></slot>
        </p>
      </div>
    );
  },
});

customElements.define('ui-text-input', MyComponent);