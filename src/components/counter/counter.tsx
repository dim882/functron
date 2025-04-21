import { createComponent, EventHandler, jsx, RenderFunc } from '../../lib/ComponentFactory';

interface ICounterModel {
  count: number;
}

const initialModel: ICounterModel = { count: 0 };

// Modified to accept a parameter
const incrementCounter: EventHandler<ICounterModel, number, MouseEvent> = (amount) => (event, model) => ({
  ...model,
  count: model.count + amount,
});

const handlers = {
  incrementCounter,
};

// The render function now receives handler factories that need to be called with a parameter
const render: RenderFunc<ICounterModel, number, typeof handlers> = ({ count }, { incrementCounter }) => (
  <div>
    <button on={{ click: incrementCounter(1) }}>Add 1</button>
    <button on={{ click: incrementCounter(5) }}>Add 5</button>
    <button on={{ click: incrementCounter(10) }}>Add 10</button>
    <div>{count}</div>
  </div>
);

const MyComponent = createComponent<[], ICounterModel, number, typeof handlers, typeof render>({
  initialModel,
  handlers,
  render,
});

customElements.define('ui-counter', MyComponent);
