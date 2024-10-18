import { createComponent, EventHandler, InternalEventHandler, jsx, RenderFunc } from '../../lib/ComponentFactory';

interface ICounterModel {
  count: number;
}

const initialModel: ICounterModel = { count: 0 };

const incrementCounter: EventHandler<ICounterModel, MouseEvent> = (event, model) => ({
  ...model,
  count: model.count + 1,
});

const render: RenderFunc<ICounterModel, { incrementCounter: InternalEventHandler<ICounterModel, MouseEvent> }> = (
  { count },
  { incrementCounter }
) => (
  <div>
    <button on={{ click: incrementCounter }}>Add 1</button>
    <div>{count}</div>
  </div>
);

const MyComponent = createComponent<[], ICounterModel>({
  initialModel,
  handlers: { incrementCounter },
  render: (model, handlers) => render(model, handlers),
});

customElements.define('ui-counter', MyComponent);
