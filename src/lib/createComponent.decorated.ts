import { applyCss } from './CssUtils.js';
import { createComponent } from './createComponent.base.js';
import { patchRootElement, h } from './snabbdomHelper'; // Adjust the import path accordingly

export function createDecoratedComponent<AttributeNames extends string[], Model>({
  css,
  cssPath,
  attributes,
  constructor,
}: {
  css?: string;
  cssPath?: string;
  attributes?: AttributeNames;
  mapAttributesToModel?: (attributes: Record<AttributeNames[number], string>, model: Model) => Model;
  shadowDomSettings?: ShadowRootInit;
  connectedCallback?: () => void;
}) {
  return createComponent({
    attributes,

    constructor(instance) {
      constructor();
    },

    connectedCallback: async (instance) => {
      renderToInnerHTML(instance.container, instance.model as Model);
      await applyCss(instance.getShadow(), cssPath, css);
    },
  });
}
