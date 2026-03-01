/** @jsx jsx */
import { jsx, createWebComponent } from '../../lib/ComponentFactory';
import type { RenderFunc } from '../../lib/ComponentFactory.types';

interface ITextInputModel {
  name: string;
  value: string;
}

const initialModel: ITextInputModel = { name: '', value: '' };

const render: RenderFunc<ITextInputModel> = (model) => {
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

const TextInputComponent = createWebComponent<ITextInputModel, {}, ['fieldname', 'value']>({
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

customElements.define('ui-text-input', TextInputComponent);
