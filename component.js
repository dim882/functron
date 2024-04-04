class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Create slots for content projection
    this.shadowRoot.innerHTML = `
          <style>
              :host {
                  display: block;
                  border: 2px solid black;
                  padding: 10px;
                  font-family: sans-serif;
              }
          </style>
          <div>
              <slot name="title">Default Title</slot>
              <p><slot name="content">Default content.</slot></p>
          </div>
      `;
  }

  connectedCallback() {
    console.log("Custom element added to page.");
    this.render();
  }

  static get observedAttributes() {
    return ["name"];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    console.log(`Attribute ${attrName} changed from ${oldVal} to ${newVal}`);
    this.render();
  }

  render() {
    // Update component in response to attribute changes
    if (this.hasAttribute("name")) {
      this.shadowRoot.querySelector('slot[name="title"]').textContent =
        this.getAttribute("name");
    }
  }
}

// Define the new element
customElements.define("my-component", MyComponent);
