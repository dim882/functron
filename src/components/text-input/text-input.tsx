import { createComponent, jsx, RenderFunc } from '../../lib/ComponentFactory';

interface ITextInputModel {
  name: string;
  value: string;
}

const initialModel: ITextInputModel = { name: '', value: '' };

const render: RenderFunc<ITextInputModel, Event, {}> = (model) => {
  return (
    <span class={{ outer: true }}>
      <div>
        <label>{model.name}</label>
        <input 
          type="text" 
          attrs={{ name: model.name, value: model.value }}
        ></input>
      </div>
    </span>
  );
};

const MyComponent = createComponent<['fieldname', 'value'], ITextInputModel, Event, {}, typeof render>({
  cssPath: './text-input.css',
  attributes: ['fieldname', 'value'],
  initialModel,
  mapAttributesToModel(attributes, model) {
    return {
      ...model,
      name: attributes.fieldname,
      value: attributes.value,
    };
  },
  render,
});

customElements.define('ui-text-input', MyComponent);
