import { init, classModule, propsModule, styleModule, eventListenersModule, attributesModule, h, jsx } from 'snabbdom';

// prettier-ignore
const patchDom = init([
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  attributesModule, 
]);

export { jsx, patchDom };
