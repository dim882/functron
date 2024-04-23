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
    }

    async connectedCallback() {
      console.log('--- connectedCallback');
      const templateParams = getAttributes(this);
      const content = typeof template === 'function' ? template(templateParams) : template;

      // this.#shadowRoot.innerHTML = `<style>${css}</style>${content}`;
      this.#shadowRoot.innerHTML = `${content}`;

      const style = document.createElement('style');
      this.#shadowRoot.appendChild(style);
      let cssText;

      if (cssPath) {
        cssText = await loadCSS(cssPath);
      } else if (css) {
        cssText = css;
      }
      style.textContent = cssText;
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

async function loadCSS(cssFilePath: string) {
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
