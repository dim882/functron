export type IAttrHandler = ({ value }: { value: string }) => string;

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

      const attributes = getAttributes(this);

      console.log({ attributes });

      const content = typeof template === 'function' ? template(this) : template;

      this.#shadowRoot.innerHTML = `<style>${css}</style>${content}`;
    }

    connectedCallback() {
      // console.log('Custom element added to page.');
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
      console.log(`Attribute ${attrName} changed from ${oldVal} to ${newVal}`);

      attrHandlers[attrName]({
        value: this.getAttribute(attrName),
      });

      // TODO: Use attrHandlers to apply changes to the DOM?
      // shadowRoot.querySelector('slot[name="${attrName}"]').textContent = value;
    }

    disconnectedCallback() {}
    adoptedCallback() {}
  }

  return Component;
}

function getAttributes(component: HTMLElement) {
  return Object.fromEntries(
    component.getAttributeNames().map((attrName) => {
      return [attrName, component.getAttribute(attrName)];
    })
  );
}
