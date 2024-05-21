export interface ICreateComponentArgs<AttributeNames extends string[]> {
  constructor: (element: HTMLElement) => void;
  connectedCallback: (element: HTMLElement) => void;
  disconnectedCallback?: (element: HTMLElement) => void;
  attributeChangedCallback?: (element: HTMLElement, attrName: string, oldVal: string, newVal: string) => void;
  adoptedCallback?: (element: HTMLElement) => void;
  attributes?: AttributeNames;
}

export interface ComposeElement extends HTMLElement {
  setModel();
}

export function createComponent<AttributeNames extends string[], Model = void>({
  attributes,
  constructor,
  connectedCallback,
  disconnectedCallback,
  attributeChangedCallback,
  adoptedCallback,
}: ICreateComponentArgs<AttributeNames>) {
  class Component extends HTMLElement implements ComposeElement {
    public model: Model;
    public shadowRoot: ShadowRoot;
    public container: HTMLElement;

    static get observedAttributes() {
      return attributes;
    }

    constructor() {
      // console.log('--- constructor');

      super();
      constructor(this);
    }

    async connectedCallback() {
      // console.log('--- connectedCallback');

      connectedCallback(this);
    }

    attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
      console.log(`--- ?attributeChangedCallback: ${attrName}: from ${oldVal} to ${newVal}`);

      attributeChangedCallback(this, attrName, oldVal, newVal);
    }

    disconnectedCallback() {
      disconnectedCallback(this);
    }

    adoptedCallback() {
      adoptedCallback(this);
    }

    setModel(newModel: Model) {
      this.model = {
        ...this.model,
        ...newModel,
      };
    }
  }

  return Component;
}
