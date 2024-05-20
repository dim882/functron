import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  attributesModule,
  h,
  jsx,
  VNode,
} from 'snabbdom';

// prettier-ignore
const patch = init([
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  attributesModule, 
]);

export function renderSnabbdom(container: Element, vNode: VNode) {
  patch(container, vNode);
}

export { h };
