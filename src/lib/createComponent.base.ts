import { patchRootElement } from './snabbdomHelper';

export interface ICreateComponentArgs<AttributeNames extends string[], Model> {
  // constructor?: (instance: ComposeElement<Model>) => void;
  connectedCallback?: (instance: ComposeElement<Model>) => void;
  disconnectedCallback?: (instance: ComposeElement<Model>) => void;
  attributeChangedCallback?: (
    instance: ComposeElement<Model>,
    attrName: string,
    oldVal: string,
    newVal: string
  ) => void;
  adoptedCallback?: (element: HTMLElement) => void;
  attributes?: AttributeNames;
  shadowDomSettings?: ShadowRootInit;
  mapAttributesToModel?: (attributes: Record<AttributeNames[number], string>, model: Model) => Model;
  render: (params: Model) => any; // Adjusted to return Snabbdom VNode
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
  ///
  shadowDomSettings,
  mapAttributesToModel,
  render,
}: ICreateComponentArgs<AttributeNames, Model>) {
  type Attributes = Record<AttributeNames[number], string>;

  class Component extends HTMLElement implements ComposeElement<Model> {
    public model: Model;
    public shadowRoot: ShadowRoot;
    public container: HTMLElement;

    static get observedAttributes() {
      return attributes;
    }

    constructor() {
      super();
      this.setUpShadowDom(shadowDomSettings);
      this.container = document.createElement('div');
      this.getShadow().appendChild(this.container);
    }

    setUpShadowDom(settings?: ShadowRootInit) {
      console.log({ settings });

      const shadowRoot = this.attachShadow(settings);
      console.log('shadowRoot', shadowRoot);
    }

    getShadow() {
      return this.shadowRoot;
    }

    async connectedCallback() {
      // console.log('--- connectedCallback');
      // connectedCallback(this);
    }

    attributeChangedCallback(instance, attrName: string, oldVal: string, newVal: string) {
      if (mapAttributesToModel) {
        const newModel = mapAttributesToModel(getAttributes(this), this.model);

        this.setModel(newModel);
        renderToInnerHTML(this.container, this.model);
      }
    }

    disconnectedCallback() {
      // disconnectedCallback(this);
    }

    adoptedCallback() {
      // adoptedCallback(this);
    }

    setModel(patch: Model) {
      this.model = {
        ...this.model,
        ...patch,
      };
    }
  }

  function renderToInnerHTML(container: HTMLElement, model: Model) {
    patchRootElement(container, render(model));
  }

  function getAttributes(component: HTMLElement): Attributes {
    return Object.fromEntries(
      component.getAttributeNames().map((attrName) => [attrName, component.getAttribute(attrName)])
    ) as Attributes;
  }
  return Component;
}
