export type IAttrHandler = ({ shadowRoot, value }: { shadowRoot: ShadowRoot; value: string }) => void;

export function createComponent<T>({
  template,
  css,
  attrHandlers,
  shadowDomSettings = {
    mode: 'closed',
    delegatesFocus: true,
  },
}: {
  template: string | ((element: HTMLElement) => string);
  css: string;
  attrHandlers?: Record<string, IAttrHandler>;
  shadowDomSettings?: ShadowRootInit;
}) {
  class Component extends HTMLElement {
    #shadowRoot: ShadowRoot;

    constructor() {
      super();

      this.#shadowRoot = this.attachShadow(shadowDomSettings);

      const content = typeof template === 'function' ? template(this) : template;

      this.#shadowRoot.innerHTML = `<style>${css}</style>${content}`;

      console.log(this.getBoundingClientRect());
    }

    connectedCallback() {
      console.log('Custom element added to page.');
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
      console.log(`Attribute ${attrName} changed from ${oldVal} to ${newVal}`);

      attrHandlers[attrName]({
        shadowRoot: this.#shadowRoot,
        value: this.getAttribute(attrName),
      });
    }

    disconnectedCallback() {}
    adoptedCallback() {}
  }

  return Component;
}
