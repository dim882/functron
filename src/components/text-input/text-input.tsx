/** @jsx h */
import { createComponent } from '../../lib/createComponent.base';
import { h } from '../../lib/snabbdomHelper';

const MyComponent = createComponent<['fieldname', 'value'], { name: string; value: string }>({
  tagName: 'text-input',
  cssPath: './text-input.css',
  // attributes: ['fieldname', 'value'],
  shadowDomSettings: {
    mode: 'open',
  },
  mapAttributesToModel(attributes, state) {
    return {
      ...state,
      name: attributes.fieldname,
      value: attributes.value + '!',
    };
  },
  render: (state) => {
    console.log('state', state);

    return (
      <div>
        <div>
          foo
          <input type="text" name={state?.name} value={state?.value}></input>
        </div>
        <label>
          <slot name="label"></slot>
        </label>
        <p class="my-message">
          <slot name="message"></slot>
        </p>
      </div>
    );
  },
});

customElements.define('ui-text-input', MyComponent);
