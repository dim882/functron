import { jsx } from 'snabbdom';
import { createComponent } from '../../lib/createComponent.base';
import { h } from '../../lib/snabbdomHelper';

const MyComponent = createComponent<['fieldname', 'value'], { name: string; value: string }>({
  tagName: 'text-input',
  // cssPath: './text-input.css',
  attributes: ['fieldname', 'value'],
  shadowDomSettings: {
    mode: 'open',
  },
  mapAttributesToModel(attributes, model) {
    return {
      ...model,
      name: attributes.fieldname,
      value: attributes.value,
    };
  },
  render: (model) => {
    console.log('text-input model', model);

    return (
      <div>
        foo foo
        <div>bar</div>
        <div>
          <input type="text" attrs={{ name: model?.name, value: model?.value }}></input>
        </div>
      </div>
    );
  },
});

customElements.define('ui-text-input', MyComponent);
