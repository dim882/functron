import { createComponent } from '../../lib/ComponentFactory';
import { counterConfig } from './counter';

const app = document.getElementById('app');
if (app) {
  const counter = createComponent(counterConfig);
  counter.mount(app);
}
