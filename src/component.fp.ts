export type IAttrHandler = ({
  self,
  shadowRoot,
  value,
}: {
  self: HTMLElement;
  shadowRoot: ShadowRoot;
  value: string;
}) => void;

export function createComponent({
  template,
  css,
  attrHandlers,
  shadowDomSettings = {
    mode: 'closed',
    delegatesFocus: true,
  },
}: {
  template: string;
  css: string;
  attrHandlers?: Record<string, IAttrHandler>;
  shadowDomSettings?: ShadowRootInit;
}) {
  class Component extends HTMLElement {
    #shadowRoot;

    constructor() {
      super();

      this.#shadowRoot = this.attachShadow(shadowDomSettings);

      this.#shadowRoot.innerHTML = `<style>${css}</style>${template}`;
    }

    connectedCallback() {
      console.log('Custom element added to page.');

      // TODO: Render with any attributes
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
      console.log(`Attribute ${attrName} changed from ${oldVal} to ${newVal}`);
      const slotElement = this.#shadowRoot.querySelector(`slot[name='${attrName}']`);

      attrHandlers[attrName]({
        self: this,
        shadowRoot: this.#shadowRoot,
        value: this.getAttribute(attrName),
      });
    }

    disconnectedCallback() {}
    adoptedCallback() {}
  }

  return Component;
}
