const style = `
:host {
  display: block;
  border: 2px solid black;
  padding: 10px;
  font-family: sans-serif;
}

:host(:hover) ::slotted(div) {
  color: red;
}
`;

const dom = `
  <div>
    <input type="text" name="first_name"/>
    <br/>
    <slot name="title">Default Title</slot>
    <p><slot name="children">Default content.</slot></p>
  </div>
`;

class MyComponent extends HTMLElement {
  #shadowRoot;

  constructor() {
    super();
    // Using mode: closed and attaching it to a private member enforces encapsulation
    // delegatesFocus: This helps with accessibility but doesn't solve all
    //   maccessibility issues.  This will cause focus to go to the first focusable
    //   melement if a user tabs into the shadow DOM, but it doesn't solve the
    //   missues with relationship bindings between elements like <label> and
    //   <input> if they are on opposite sides of the shadow DOM boundary
    this.#shadowRoot = this.attachShadow({
      mode: 'closed',
      delegatesFocus: true,
    });

    // Create slots for content projection
    this.#shadowRoot.innerHTML = `
      <style>${style}</style>
      ${dom}
    `;
  }

  connectedCallback() {
    console.log('Custom element added to page.');
    this.update();
  }

  static get observedAttributes() {
    return ['name'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    console.log(`Attribute ${attrName} changed from ${oldVal} to ${newVal}`);
    this.update();
  }

  update() {
    // Update component in response to attribute changes
    if (this.hasAttribute('name')) {
      this.#shadowRoot.querySelector('slot[name="title"]').textContent = this.getAttribute('name');
    }
  }
}

// Define the new element
customElements.define('my-component', MyComponent);
