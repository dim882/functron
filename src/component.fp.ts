export type IAttrHandler = (self: HTMLElement, shadowRoot: ShadowRoot) => void;

export function createComponent({
  componentName,
  template,
  css,
  attrHandlers,
}: {
  componentName: string;
  template: string;
  css: string;
  attrHandlers: Record<string, IAttrHandler>;
}) {
  class Component extends HTMLElement {
    #shadowRoot;

    constructor() {
      super();

      this.#shadowRoot = this.attachShadow({
        mode: 'closed',
        delegatesFocus: true,
      });

      this.#shadowRoot.innerHTML = `<style>${css}</style>${template}`;
    }

    connectedCallback() {
      console.log('Custom element added to page.');

      // TODO: Render with any attributes
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
      console.log(`Attribute ${attrName} changed from ${oldVal} to ${newVal}`);
      attrHandlers[attrName](this, this.#shadowRoot);
    }

    disconnectedCallback() {}
    adoptedCallback() {}
  }

  console.log('creating element ', componentName);

  customElements.define(componentName, Component);

  return Component;
}
