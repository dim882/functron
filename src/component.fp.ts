type IAttrHandler = (self: HTMLElement, shadowRoot: ShadowRoot) => void;

const handleName: IAttrHandler = (self: HTMLElement, shadowRoot: ShadowRoot) => {
  shadowRoot.querySelector('slot[name="title"]').textContent = self.getAttribute('name');
};

export function createComponent({
  name,
  template,
  css,
  attributes,
}: {
  name: string;
  template: string;
  css: string;
  attributes: string[];
  attrHandlers?: Record<string, unknown>;
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
      this.update();
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
      console.log(`Attribute ${attrName} changed from ${oldVal} to ${newVal}`);
      this.update();
    }

    update() {
      if (this.hasAttribute('name')) {
        handleName(this, this.#shadowRoot);
      }
    }
  }

  console.log('creating element ', name);

  customElements.define(name, Component);

  return Component;
}
