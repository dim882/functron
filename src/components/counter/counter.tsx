import { createComponent, EventHandler, jsx } from '../../lib/ComponentFactory';

interface ICounterModel {
  count: number;
};

const incrementCounter: EventHandler<ICounterModel, MouseEvent> = (event, model) => {
  return ({
    ...model,
    count: model.count + 1
  })
};

const MyComponent = createComponent<[], ICounterModel>({
  initialModel: { count: 0 },
  handlers: {
    onClick: incrementCounter
  },
  render: ({ count }, { onClick }) => (
    <div>
       <button on={{ click: onClick }}>Add 1</button>
       <div>{count}</div> 
    </div>
  ),
});

customElements.define('ui-counter', MyComponent);
