import { createComponent, jsx } from '../../lib/ComponentFactory';

interface ITextInputModel {
  name: string;
  value: string;
};

const MyComponent = createComponent<['fieldname', 'value'], ITextInputModel>({
  cssPath: './text-input.css',
  attributes: ['fieldname', 'value'],
  initialModel: { name: '', value: '' },
  mapAttributesToModel(attributes, model) {
    return {
      ...model,
      name: attributes.fieldname,
      value: attributes.value,
    };
  },
  render: (model) => {
    return (
      <span class={{ outer: true }}>
        <div>
          <label>{model.name}</label>
          <input type="text" attrs={{ name: model.name, value: model.value }}></input>
        </div>
      </span>
    );
  },
});

customElements.define('ui-text-input', MyComponent);
