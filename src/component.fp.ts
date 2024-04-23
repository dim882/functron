export type IAttrHandler = ({ value }: { value: string }) => string;

export type ITemplateParams = Record<string, string>;

export function createComponent<T>({
  template,
  css,
  cssPath,
  attrHandlers,
  shadowDomSettings = {
    mode: 'closed',
    delegatesFocus: true,
  },
}: {
  template: string | ((params: ITemplateParams) => string);
  css?: string;
  cssPath?: string;
  attrHandlers?: Record<string, IAttrHandler>;
  shadowDomSettings?: ShadowRootInit;
}) {
  class Component extends HTMLElement {
    #shadowRoot: ShadowRoot;
    attributeChangedCallback: (attrName: any, oldVal: any, newVal: any) => void;

    static get observedAttributes() {
      return Object.keys(attrHandlers);
    }

    constructor() {
      console.log('--- constructor');

      super();

      this.#shadowRoot = this.attachShadow(shadowDomSettings);
      console.log('shadowRoot', this.#shadowRoot);
    }

    connectedCallback() {
      console.log('--- connectedCallback');
      const templateParams = getAttributes(this);
      const content = typeof template === 'function' ? template(templateParams) : template;
      // this.#shadowRoot.innerHTML = `<style>${css}</style>${content}`;
      this.#shadowRoot.innerHTML = `${content}`;
      loadAndApplyCSS(this.#shadowRoot, cssPath);
    }

    disconnectedCallback() {}

    adoptedCallback() {}
  }

  Component.prototype.attributeChangedCallback = (attrName, oldVal, newVal) => {
    console.log(`--- attributeChangedCallback Attribute ${attrName} changed from ${oldVal} to ${newVal}`);
  };

  function getAttributes(component: HTMLElement) {
    return Object.fromEntries(
      component.getAttributeNames().map((attrName) => {
        return [attrName, component.getAttribute(attrName)];
      })
    );
  }

  return Component;
}

async function loadAndApplyCSS(rootElement: ShadowRoot, cssFilePath: string) {
  console.log('loading ', cssFilePath);

  const style = document.createElement('style');
  console.log('applying styles to ', { rootElement });

  rootElement.appendChild(style);

  try {
    const response = await fetch(cssFilePath);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const cssText = await response.text();

    style.textContent = cssText;
  } catch (error) {
    console.error('Failed to fetch CSS:', error);
  }
}
