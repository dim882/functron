import { createComponent, EventHandler, jsx } from '../../lib/ComponentFactory';
import { VNode } from 'snabbdom';

interface ICounterModel {
  count: number;
}

interface RenderFunc<TModel, THandlers extends Partial<EventHandlerMap<TModel>> = EventHandlerMap<TModel>> {
  (model: TModel, handlers: THandlers): VNode;
}

const initialModel: ICounterModel = { count: 0 };

const incrementCounter: EventHandler<ICounterModel, MouseEvent> = (event, model) => ({
  ...model,
  count: model.count + 1,
});

type EventHandlerMap<TModel> = {
  [key: string]: EventHandler<TModel, any>;
};

const render: RenderFunc<ICounterModel, { incrementCounter: EventHandler<ICounterModel, MouseEvent> }> = (
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
  render,
});

customElements.define('ui-counter', MyComponent);
