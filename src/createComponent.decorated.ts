export function createComponent<AttributeNames extends string[], State>({
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
  render: string | ((params: State) => string);
  css?: string;
  cssPath?: string;
  attributes?: AttributeNames;
  mapAttributesToState?: (attributes: Record<AttributeNames[number], string>, state: State) => State;
  shadowDomSettings?: ShadowRootInit;
}) {
  type Attributes = Record<AttributeNames[number], string>;

  class Component extends HTMLElement {
    #shadowRoot: ShadowRoot;
    #state: State;

    static get observedAttributes() {
      return attributes;
    }

    constructor() {
      super();

      this.#shadowRoot = this.attachShadow(shadowDomSettings);
    }

    async connectedCallback() {
      console.log('--- connectedCallback');

      const content = typeof render === 'function' ? render(this.#state) : render;

      this.#shadowRoot.innerHTML = content;

      await applyCss(this.#shadowRoot, cssPath, css);
    }

    attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
      console.log(`--- ?attributeChangedCallback: ${attrName}: from ${oldVal} to ${newVal}`);

      if (mapAttributesToState) {
        const newState = mapAttributesToState(getAttributes(this), this.#state);

        this.setState(newState);
      }
    }

    disconnectedCallback() {}

    adoptedCallback() {}

    setState(newState: State) {
      this.#state = {
        ...this.#state,
        ...newState,
      };
    }
  }

  function getAttributes(component: HTMLElement): Attributes {
    return Object.fromEntries(
      component.getAttributeNames().map((attrName) => {
        return [attrName, component.getAttribute(attrName)];
      })
    ) as Attributes;
  }

  return Component;
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
