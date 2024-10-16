import { createComponent, EventHandler, jsx } from '../../lib/ComponentFactory';

interface ICounterModel {
  count: number;
}

const initialModel: ICounterModel = { count: 0 };

const incrementCounter: EventHandler<ICounterModel, MouseEvent> = (event, model) => ({
  ...model,
  count: model.count + 1,
});

const render = (
  { count }: ICounterModel,
  { incrementCounter }: { incrementCounter: EventHandler<ICounterModel, MouseEvent> }
) => (
  <div>
    <button on={{ click: incrementCounter }}>Add 1</button>
    <div>{count}</div>
  </div>
);

const MyComponent = createComponent<[], ICounterModel>({
  initialModel,
  handlers: { incrementCounter },
  render,
});

customElements.define('ui-counter', MyComponent);
