/** @jsx jsx */
import { createComponent, jsx } from '../../lib/ComponentFactory';
import type { RenderFunc } from '../../lib/ComponentFactory.types';

interface IRouterModel { }

export const EVENT_ROUTE_CHANGE = 'routechange';

const initialModel = { };

const render: RenderFunc = () => {
  return <slot/>
};

const RouterComponent = createComponent<IRouterModel>({
  initialModel,
  render,
  connectedCallback: (element) => {
    const routes = element.querySelectorAll('ui-route');
    
    window.addEventListener(EVENT_ROUTE_CHANGE, (event) => {
      routes.forEach((el)=> {
        const path = el.getAttribute('path')

        if (el.getAttribute('path') === event.detail.path) {
          el.setAttribute('active', 'true') 
          window.history.pushState({}, '', `#${path}`);
        } else {
          el.removeAttribute('active')
        }
      })
    });
  }
});

customElements.define('ui-router', RouterComponent); 