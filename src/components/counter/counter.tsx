import { createComponent, EventHandler, InternalEventHandler, jsx, RenderFunc } from '../../lib/ComponentFactory';

interface ICounterModel {
  count: number;
}

const initialModel: ICounterModel = { count: 0 };

const incrementCounter: EventHandler<ICounterModel, MouseEvent> = (event, model) => ({
  ...model,
  count: model.count + 1,
});

const handlers = {
  incrementCounter,
};

const render: RenderFunc<ICounterModel, typeof handlers> = ({ count }, { incrementCounter }) => (
  <div>
    <button on={{ click: incrementCounter }}>Add 1</button>
    <div>{count}</div>
  </div>
);

const MyComponent = createComponent<[], ICounterModel>({
  initialModel,
  handlers,
  render: (model, handlers) => render(model, handlers),
});

customElements.define('ui-counter', MyComponent);
