export type IAttrHandler<Attributes, State> = () => State;

// const defaultHandler: IAttrHandler = ({ value }) => (value ? value : '');

export function createComponent<AttributeNames extends string[], State>({
  template,
  css,
  cssPath,
  attributes,
  mapAttributesToState,
  shadowDomSettings = {
    mode: 'closed',
    delegatesFocus: true,
  },
}: {
  template: string | ((params: State) => string);
  css?: string;
  cssPath?: string;
  attributes?: AttributeNames;
  mapAttributesToState?: (attributes: Record<AttributeNames[number], string>, state: State) => State;
  shadowDomSettings?: ShadowRootInit;
}) {
  class Component extends HTMLElement {
    #shadowRoot: ShadowRoot;
    #state: State;

    static get observedAttributes() {
      return attributes;
    }

    constructor() {
      console.log('--- constructor');

      super();

      this.#shadowRoot = this.attachShadow(shadowDomSettings);
    }

    async connectedCallback() {
      console.log('--- connectedCallback');
      console.log('attributes', this.getAttributeNames());

      const content = typeof template === 'function' ? template(this.#state) : template;

      this.#shadowRoot.innerHTML = content;

      await applyCss(this.#shadowRoot, cssPath, css);
    }

    attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
      console.log(`--- ?attributeChangedCallback: ${attrName}: from ${oldVal} to ${newVal}`);

      if (mapAttributesToState) {
        const newState = mapAttributesToState(getAttributes(this), this.#state);
        console.log({ newState });

        this.setState(newState);
      }
      console.log('state', this.#state);
    }

    // private mapAttributesToState(attrName: string, newVal: string) {
    //   this.setState({
    //     [attrName]: newVal,
    //   });
    // }

    disconnectedCallback() {}

    adoptedCallback() {}

    setState(newState: State) {
      this.#state = {
        ...this.#state,
        ...newState,
      };
    }
  }

  function getAttributes(component: HTMLElement): Record<AttributeNames[number], string> {
    return Object.fromEntries(
      component.getAttributeNames().map((attrName) => {
        return [attrName, component.getAttribute(attrName)];
      })
    ) as Record<AttributeNames[number], string>;
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
