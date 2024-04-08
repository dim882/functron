export function createComponent(
  name: string,
  template: string,
  css: string,
  attributes: string[]
) {
  class Component extends HTMLElement {
    #shadowRoot;

    constructor() {
      super();

      this.#shadowRoot = this.attachShadow({
        mode: "closed",
        delegatesFocus: true,
      });

      this.#shadowRoot.innerHTML = `<style>${css}</style>${template}`;
    }

    connectedCallback() {
      console.log("Custom element added to page.");
      this.update();
    }

    static get observedAttributes() {
      return attributes;
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
      console.log(`Attribute ${attrName} changed from ${oldVal} to ${newVal}`);
      this.update();
    }

    update() {
      if (this.hasAttribute("name")) {
        this.#shadowRoot.querySelector('slot[name="title"]').textContent =
          this.getAttribute("name");
      }
    }
  }

  console.log("creating element");

  customElements.define(name, Component);

  return Component;
}
