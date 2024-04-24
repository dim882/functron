export type IAttrHandler = ({ value }: { value: string }) => string;

export function createComponent<A, S = A>({
  template,
  css,
  cssPath,
  attrHandlers,
  shadowDomSettings = {
    mode: 'closed',
    delegatesFocus: true,
  },
}: {
  template: string | ((params: S) => string);
  css?: string;
  cssPath?: string;
  attrHandlers?: Record<string, IAttrHandler>;
  shadowDomSettings?: ShadowRootInit;
}) {
  class Component extends HTMLElement {
    #shadowRoot: ShadowRoot;
    #state: S;

    static get observedAttributes() {
      return Object.keys(attrHandlers);
    }

    constructor() {
      console.log('--- constructor');

      super();

      this.#shadowRoot = this.attachShadow(shadowDomSettings);
    }

    async connectedCallback() {
      console.log('--- connectedCallback');

      // TODO implement attribute handling
      this.setState(getAttributes(this));

      const content = typeof template === 'function' ? template(this.#state) : template;

      this.#shadowRoot.innerHTML = content;

      await applyCss(this.#shadowRoot, cssPath, css);
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
      console.log(`--- ?attributeChangedCallback: ${attrName}: from ${oldVal} to ${newVal}`);

      // TODO: Expose attribute handling hook to call here
      // type AttributeHandler = (A) => S
      this.setState({
        [attrName]: newVal,
      });
    }

    disconnectedCallback() {}

    adoptedCallback() {}

    setState(newState: object) {
      this.#state = {
        ...this.#state,
        ...newState,
      };
    }
  }

  function getAttributes(component: HTMLElement) {
    return Object.fromEntries(
      component.getAttributeNames().map((attrName) => {
        return [attrName, component.getAttribute(attrName)];
      })
    );
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
