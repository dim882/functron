import { createComponent, jsx } from '../../lib/ComponentFactory';

interface ICounterModel {
  count: number;
};

const MyComponent = createComponent<[], ICounterModel>({
  initialModel: { count: 0 },
  render: () => (
    <div>
      
    </div>
  ),
});

customElements.define('ui-form', MyComponent);
