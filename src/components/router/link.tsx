/** @jsx jsx */
import { jsx, createWebComponent } from '../../lib/ComponentFactory';
import type { Handler, RenderFunc } from '../../lib/ComponentFactory.types';
import { EVENT_ROUTE_CHANGE } from './router';

interface ILinkModel {
  to: string;
}

const initialModel: ILinkModel = {
  to: '',
};

function createRouteChangeEvent(to: string) {
  return new CustomEvent(EVENT_ROUTE_CHANGE, {
    detail: { path: to },
    bubbles: true,
    composed: true
  });
}

const navigate: Handler<ILinkModel, [], MouseEvent> = () => (event, model) => {
  event.preventDefault();

  if (event.currentTarget instanceof HTMLElement) {
    const routeChangeEvent = createRouteChangeEvent(model.to);
    event.currentTarget.dispatchEvent(routeChangeEvent);
  }

  return model;
};

const handlers = {
  navigate
} as const;

const render: RenderFunc<ILinkModel, typeof handlers> = ({ to }, { navigate }) => (
  <a href={to} on={{ click: navigate() }}>
    <slot/>
  </a>
);

const LinkComponent = createWebComponent<ILinkModel, typeof handlers, ['to']>({
  initialModel,
  handlers,
  render,
  attributes: ['to'],
  mapAttributesToModel: (attrs, model) => ({
    ...model,
    to: attrs.to ?? model.to,
  })
});

customElements.define('ui-link', LinkComponent);
