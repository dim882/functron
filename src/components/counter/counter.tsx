import { createComponent, jsx } from '../../lib/ComponentFactory';
import type { EventHandler, EventHandlerFactory, RenderFunc } from '../../lib/ComponentFactory.types';

interface ICounterModel {
  count: number;
}

const initialModel: ICounterModel = { count: 0 };

const incrementCounter: EventHandlerFactory<ICounterModel, number, MouseEvent> = (amount) => (event, model) => ({
  ...model,
  count: model.count + amount,
});

const resetCounter: EventHandler<ICounterModel, MouseEvent> = (event, model) => ({
  ...model,
  count: 0,
});

const handlers = {
  incrementCounter,
  resetCounter,
};

const render: RenderFunc<ICounterModel, typeof handlers> = ({ count }, { incrementCounter, resetCounter }) => (
  <div>
    <button on={{ click: incrementCounter(1) }}>Add 1</button>
    <button on={{ click: incrementCounter(5) }}>Add 5</button>
    <button on={{ click: incrementCounter(10) }}>Add 10</button>
    <button on={{ click: resetCounter }}>Reset</button>
    <div>Count: {count}</div>
  </div>
);

const MyComponent = createComponent<ICounterModel, typeof handlers>({
  initialModel,
  handlers,
  render,
});

customElements.define('ui-counter', MyComponent);
