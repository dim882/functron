import { VNode } from 'snabbdom';
import { applyCss } from './CssUtils';
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
  render: (params: Model) => VNode;
  css?: string;
  cssPath?: string;
}

export interface ComposeElement<Model> extends HTMLElement {
  setModel: (newModel: Model) => void;
  model: Model;
  shadowRoot: ShadowRoot;
  container: HTMLElement;
}

export function createComponent<AttributeNames extends string[], Model>({
  attributes,
  shadowDomSettings,
  mapAttributesToModel,
  render,
  css,
  cssPath,
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
      this.attachShadow(shadowDomSettings);
      this.container = document.createElement('div');
      this.shadowRoot.appendChild(this.container);
    }

    async connectedCallback() {
      // console.log('--- connectedCallback');
      renderToInnerHTML(this.container, this.model);
      await applyCss(this.shadowRoot, cssPath, css);
    }

    attributeChangedCallback(instance, attrName: string, oldVal: string, newVal: string) {
      if (mapAttributesToModel) {
        const newModel = mapAttributesToModel(getAttributes(this), this.model);
        console.log({ newModel });

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
