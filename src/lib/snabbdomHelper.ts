import { init, classModule, propsModule, styleModule, eventListenersModule, attributesModule, h } from 'snabbdom';

// Initialize Snabbdom with the necessary modules
const patch = init([
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  attributesModule, // Add the attributes module
]);

// Snabbdom helper function to patch the DOM
export function renderSnabbdom(container: Element, vNode: any) {
  patch(container, vNode);
}

export { h }; // Export the `h` function to create virtual DOM nodes
