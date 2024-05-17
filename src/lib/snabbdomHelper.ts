import { init, classModule, propsModule, styleModule, eventListenersModule, h } from 'snabbdom';

// Initialize Snabbdom with chosen modules
const patch = init([classModule, propsModule, styleModule, eventListenersModule]);

export function renderSnabbdom(container: Element, vNode: any) {
  patch(container, vNode);
}

export { h }; // Export `h` function to create virtual DOM nodes
