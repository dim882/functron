import { createComponent, jsx, RenderFunc } from '../../main';

interface ITextInputModel {
  name: string;
  value: string;
}

const initialModel: ITextInputModel = { name: '', value: '' };

const render: RenderFunc<ITextInputModel, {}> = (model) => {
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

const MyComponent = createComponent<ITextInputModel, {}, typeof render, ['fieldname', 'value']>({
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
