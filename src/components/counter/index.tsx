/** @jsx jsx */
import { jsx } from '../../lib/ComponentFactory';
import './counter';

const app = document.getElementById('app');
if (app) {
  app.innerHTML = '<ui-counter></ui-counter>';
} 