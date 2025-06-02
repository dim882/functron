/** @jsx jsx */
import './router';
import './link';
import './route';


const app = document.getElementById('app');
if (app) {
  app.innerHTML = `
  <nav>
    <ui-link to='/'>Home</ui-link>
    <ui-link to='/about'>About</ui-link>
  </nav>
  <ui-router>
    <ui-route path='/' active='true'>Home Content</ui-route>
    <ui-route path='/about'>About Content</ui-route>
  </ui-router>`;
} 