import { VNode } from 'snabbdom';
import { applyCss } from './CssUtils';
import { patchDom } from './VirtualDom';

export { jsx } from './VirtualDom';

export type EventHandler<Model, Event> = (event: Event, model: Model) => Model;

export type EventHandlerMap<Model> = {
  [key: string]: EventHandler<Model, any>;
};

export interface RenderFunc<TModel, THandlers extends Partial<EventHandlerMap<TModel>> = EventHandlerMap<TModel>> {
  (model: TModel, handlers: THandlers): VNode;
}

export interface ICreateComponentArgs<AttributeNames extends string[], Model> {
  connectedCallback?: (instance: FunctronElement<Model>) => void;
  disconnectedCallback?: (instance: FunctronElement<Model>) => void;
  attributeChangedCallback?: (
    instance: FunctronElement<Model>,
    attrName: string,
    oldVal: string,
    newVal: string
  ) => void;
  adoptedCallback?: (element: HTMLElement) => void;
  attributes?: AttributeNames;
  shadowDomSettings?: ShadowRootInit;
  mapAttributesToModel?: (attributes: Record<AttributeNames[number], string>, model: Model) => Model;
  render: (params: Model, handlers?: EventHandlerMap<Model>) => VNode;
  css?: string;
  cssPath?: string;
  initialModel: Model;
  handlers?: EventHandlerMap<Model>;
}

export interface FunctronElement<Model> extends HTMLElement {
  setModel: (newModel: Model) => void;
  model: Model;
  shadowRoot: ShadowRoot;
  container: HTMLElement;
}

export function createComponent<AttributeNames extends string[], Model>({
  attributes,
  shadowDomSettings = { mode: 'closed' },
  mapAttributesToModel,
  render,
  css,
  cssPath,
  initialModel,
  adoptedCallback,
  disconnectedCallback,
  handlers,
}: ICreateComponentArgs<AttributeNames, Model>) {
  type Attributes = Record<AttributeNames[number], string>;

  class Component extends HTMLElement implements FunctronElement<Model> {
    public model: Model;
    public container: HTMLElement;
    #shadowRoot: ShadowRoot;
    private vdom: VNode;

    static get observedAttributes() {
      return attributes;
    }

    constructor() {
      super();

      this.setModel(initialModel);
      this.#shadowRoot = this.attachShadow(shadowDomSettings);
      this.container = document.createElement('div');
      this.#shadowRoot.appendChild(this.container);
    }

    async connectedCallback() {
      // console.log(this.tagName, '--- connectedCallback');
      this.render(this.model);
      await applyCss(this.#shadowRoot, cssPath, css);
    }

    attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
      if (mapAttributesToModel) {
        const newModel = mapAttributesToModel(getAttributes(this), this.model);

        this.setModel(newModel);
        this.render(this.model);
      }
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

    bindHanders() {
      if (handlers) {
        const wrappedHandlers = Object.fromEntries(
          Object.entries(handlers).map(([key, handler]) => [
            key,
            (event: any) => {
              this.setModel(handler(event, this.model)), this.render(this.model);
            },
          ])
        );

        return wrappedHandlers;
      }
    }

    render(model: Model) {
      const vdom = render(model, this.bindHanders());

      if (!this.vdom) {
        patchDom(this.container, vdom);
      } else {
        patchDom(this.vdom, vdom);
      }

      this.vdom = vdom;
    }
  }

  function getAttributes(component: HTMLElement): Attributes {
    return Object.fromEntries(
      component.getAttributeNames().map((attrName) => [attrName, component.getAttribute(attrName)])
    ) as Attributes;
  }

  return Component;
}
