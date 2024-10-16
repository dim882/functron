import { createComponent, EventHandler, jsx } from '../../lib/ComponentFactory';

interface ICounterModel {
  count: number;
}

const incrementCounter: EventHandler<ICounterModel, MouseEvent> = (event, model) => ({
  ...model,
  count: model.count + 1,
});

const initialModel: ICounterModel = { count: 0 };

const render = ({ count }: ICounterModel, { onClick }: { onClick: EventHandler<ICounterModel, MouseEvent> }) => (
  <div>
    <button on={{ click: onClick }}>Add 1</button>
    <div>{count}</div>
  </div>
);

const handlers = {
  onClick: incrementCounter,
};

const MyComponent = createComponent<[], ICounterModel>({
  initialModel,
  handlers,
  render,
});

customElements.define('ui-counter', MyComponent);
