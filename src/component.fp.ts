function createComponent(template: string, css: string, attributes: string[]) {
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
      // Update component in response to attribute changes
      if (this.hasAttribute("name")) {
        this.#shadowRoot.querySelector('slot[name="title"]').textContent =
          this.getAttribute("name");
      }
    }
  }

  return Component;
}
