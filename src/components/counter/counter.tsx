import { createComponent, jsx } from '../../lib/ComponentFactory';

interface ICounterModel {
  count: number;
};

const MyComponent = createComponent<[], ICounterModel>({
  initialModel: { count: 0 },
  render: ({count}) => (
    <div>
       <button>Add 1</button>
       <div>{count}</div> 
    </div>
  ),
});

customElements.define('ui-counter', MyComponent);
