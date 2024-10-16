import { createComponent, EventHandler, jsx } from '../../lib/ComponentFactory';

interface ICounterModel {
  count: number;
}

const initialModel: ICounterModel = { count: 0 };

const incrementCounter: EventHandler<ICounterModel, MouseEvent> = (event, model) => ({
  ...model,
  count: model.count + 1,
});

const render = ({ count }: ICounterModel, { onClick }: { onClick: EventHandler<ICounterModel, MouseEvent> }) => (
  <div>
    <button on={{ click: onClick }}>Add 1</button>
    <div>{count}</div>
  </div>
);

const MyComponent = createComponent<[], ICounterModel>({
  initialModel,
  handlers: { onClick: incrementCounter },
  render,
});

customElements.define('ui-counter', MyComponent);
