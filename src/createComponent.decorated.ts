import { createComponent } from './createComponent.base.js';

export function createDecoratedComponent<AttributeNames extends string[], Model>({
  render,
  css,
  cssPath,
  attributes,
  mapAttributesToState,
  shadowDomSettings = {
    mode: 'closed',
    delegatesFocus: true,
  },
}: {
  render: (params: Model) => string;
  css?: string;
  cssPath?: string;
  attributes?: AttributeNames;
  mapAttributesToState?: (attributes: Record<AttributeNames[number], string>, state: Model) => Model;
  shadowDomSettings?: ShadowRootInit;
}) {
  type Attributes = Record<AttributeNames[number], string>;

  let shadowRoot: ShadowRoot;
  let model: Model;

  function renderToInnerHTML(model: Model) {
    shadowRoot.innerHTML = render(model);
  }

  return createComponent({
    attributes,
    constructor(element) {
      shadowRoot = element.attachShadow(shadowDomSettings);
    },

    connectedCallback: async (element) => {
      renderToInnerHTML(model);

      await applyCss(shadowRoot, cssPath, css);
    },

    attributeChangedCallback: (element, attrName: string, oldVal: string, newVal: string) => {
      if (mapAttributesToState) {
        const newModel = mapAttributesToState(getAttributes(element), model);

        setModel(newModel);
        renderToInnerHTML(newModel);
      }
    },
  });

  function setModel(newModel: Model) {
    model = {
      ...model,
      ...newModel,
    };
  }

  function getAttributes(component: HTMLElement): Attributes {
    return Object.fromEntries(
      component.getAttributeNames().map((attrName) => {
        return [attrName, component.getAttribute(attrName)];
      })
    ) as Attributes;
  }
}

async function applyCss(dom: ShadowRoot, cssPath: string, css: string) {
  const style = document.createElement('style');

  dom.appendChild(style);

  style.textContent = cssPath ? await loadCss(cssPath) : css;
}

async function loadCss(cssFilePath: string) {
  console.log('loading ', cssFilePath);

  try {
    const response = await fetch(cssFilePath);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.text();
  } catch (error) {
    console.error('Failed to fetch CSS:', error);
  }
}
