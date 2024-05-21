import { applyCss } from './CssUtils.js';
import { createComponent } from './createComponent.base.js';
import { renderSnabbdom, h } from './snabbdomHelper'; // Adjust the import path accordingly

export function createDecoratedComponent<AttributeNames extends string[], Model>({
  render,
  css,
  cssPath,
  attributes,
  mapAttributesToModel: mapAttributesToState,
  shadowDomSettings = {
    mode: 'closed',
    delegatesFocus: true,
  },
  constructor,
}: {
  render: (params: Model) => any; // Adjusted to return Snabbdom VNode
  css?: string;
  cssPath?: string;
  attributes?: AttributeNames;
  mapAttributesToModel?: (attributes: Record<AttributeNames[number], string>, model: Model) => Model;
  shadowDomSettings?: ShadowRootInit;
  connectedCallback?: () => void;
}) {
  type Attributes = Record<AttributeNames[number], string>;

  let shadowRoot: ShadowRoot;
  let container: HTMLElement;

  function renderToInnerHTML(container: HTMLElement, model: Model) {
    const vNode = render(model);
    console.log(vNode);

    renderSnabbdom(container, vNode);
  }

  return createComponent({
    attributes,
    constructor(instance) {
      shadowRoot = instance.attachShadow(shadowDomSettings);
      instance.container = document.createElement('div');
      shadowRoot.appendChild(instance.container);
      constructor();
    },

    connectedCallback: async (instance) => {
      renderToInnerHTML(instance.container, instance.model as Model);
      await applyCss(shadowRoot, cssPath, css);
    },

    attributeChangedCallback: (instance, attrName: string, oldVal: string, newVal: string) => {
      if (mapAttributesToState) {
        const model: Model = instance.model as Model;
        const newModel = mapAttributesToState(getAttributes(instance), model);

        instance.setModel(newModel);
        renderToInnerHTML(instance.container, model);
        console.log('foo', { newModel });
      }
    },
  });

  function getAttributes(component: HTMLElement): Attributes {
    return Object.fromEntries(
      component.getAttributeNames().map((attrName) => [attrName, component.getAttribute(attrName)])
    ) as Attributes;
  }
}
