/** @jsx jsx */
import { createComponent, jsx } from '../../lib/ComponentFactory';
import type { RenderFunc } from '../../lib/ComponentFactory.types';

interface IRouteModel {
  path: string;
  isActive: boolean;
}

const initialModel: IRouteModel = {
  path: '',
  isActive: false
};

const render: RenderFunc<IRouteModel, {}> = ({ path, isActive }) => {
  return (
    <div>
      {isActive && <slot/> }
    </div>
  )};

const RouteComponent = createComponent<IRouteModel, {}, typeof render, ['path', 'active']>({
  initialModel,
  render,
  attributes: ['path', 'active'],
  mapAttributesToModel: (attrs, model) => {
    return {
      ...model,
      path: attrs.path ?? model.path,
      isActive: !!attrs.active
    }
  },
});

customElements.define('ui-route', RouteComponent); 