export interface ICreateComponentArgs<AttributeNames extends string[], Model> {
  constructor: (instance: ComposeElement<Model>) => void;
  connectedCallback: (instance: ComposeElement<Model>) => void;
  disconnectedCallback?: (instance: ComposeElement<Model>) => void;
  attributeChangedCallback?: (
    instance: ComposeElement<Model>,
    attrName: string,
    oldVal: string,
    newVal: string
  ) => void;
  adoptedCallback?: (element: HTMLElement) => void;
  attributes?: AttributeNames;
}

export interface ComposeElement<Model> extends HTMLElement {
  setModel: (newModel: Model) => void;
  setUpShadowDom: (settings?: ShadowRootInit) => void;
  model: Model;
  shadowRoot: ShadowRoot;
  container: HTMLElement;
}

export function createComponent<AttributeNames extends string[], Model>({
  attributes,
  constructor,
  connectedCallback,
  disconnectedCallback,
  attributeChangedCallback,
  adoptedCallback,
}: ICreateComponentArgs<AttributeNames, Model>) {
  class Component extends HTMLElement implements ComposeElement<Model> {
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

    setUpShadowDom(settings?: ShadowRootInit) {
      const shadowRoot = this.attachShadow(settings);
      console.log('shadowRoot', shadowRoot);
    }

    getShadow() {
      return this.shadowRoot;
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

    setModel(patch: Model) {
      this.model = {
        ...this.model,
        ...patch,
      };
    }
  }

  return Component;
}
