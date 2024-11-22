import type { VNode } from 'snabbdom';
import { applyCss } from './CssUtils';
import { patchDom } from './VirtualDom';

export { jsx } from './VirtualDom';

type AnyUIEvent = any extends UIEvent ? any : never;

export type EventHandler<Model, Event extends UIEvent = AnyUIEvent> = (event: Event, model: Model) => Model;

export type EventHandlerMap<Model> = {
  [key: string]: EventHandler<Model>;
};

// This is for when we bind the handlers to call setModel() and return void
export type InternalEventHandler<Model, Event extends UIEvent = AnyUIEvent> = (event: Event, model: Model) => void;

export type EventHandlerInternalMap<Model> = {
  // The value can be an InternalEventHandler with any event type that extends UIEvent
  [key: string]: InternalEventHandler<Model, AnyUIEvent>;
};

export interface RenderFunc<
  TModel,
  THandlers extends EventHandlerInternalMap<TModel> = EventHandlerInternalMap<TModel>
> {
  (model: TModel, handlers: THandlers): VNode;
}

export type StandardComponentArgs<AttributeNames, Model> = {
  connectedCallback?: (instance: FunctronElement<Model>) => void;
  disconnectedCallback?: (instance: FunctronElement<Model>) => void;
  attributeChangedCallback?: (
    instance: FunctronElement<Model>,
    attrName: string,
    oldVal: string,
    newVal: string
  ) => void;
  adoptedCallback?: (element: HTMLElement) => void;
  shadowDomSettings?: ShadowRootInit;
  attributes?: AttributeNames;
};

export interface ICreateComponentArgs<
  AttributeNames extends string[],
  Model,
  Handlers extends EventHandlerMap<Model>,
  Render extends RenderFunc<Model, Handlers>
> extends StandardComponentArgs<AttributeNames, Model> {
  attributes?: AttributeNames;
  mapAttributesToModel?: (attributes: Record<AttributeNames[number], string>, model: Model) => Model;
  render: Render;
  css?: string;
  cssPath?: string;
  initialModel: Model;
  handlers?: Handlers;
}

export interface FunctronElement<Model> extends HTMLElement {
  setModel: (newModel: Model) => void;
  model: Model;
  container: HTMLElement;
}

export function createComponent<
  AttributeNames extends string[],
  Model,
  Handlers extends EventHandlerMap<Model>,
  Render extends RenderFunc<Model, Handlers>
>({
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
}: ICreateComponentArgs<AttributeNames, Model, Handlers, Render>) {
  type Attributes = Record<AttributeNames[number], string>;

  class Component extends HTMLElement implements FunctronElement<Model> {
    public model: Model;
    public container: HTMLElement;
    #shadowRoot: ShadowRoot;
    private vdom: VNode | null = null;

    static get observedAttributes() {
      return attributes;
    }

    constructor() {
      super();

      this.model = initialModel;
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
      disconnectedCallback?.(this);
    }

    adoptedCallback() {
      adoptedCallback?.(this);
    }

    setModel(patch: Model) {
      this.model = {
        ...this.model,
        ...patch,
      };
    }

    bindHanders(): Handlers {
      if (handlers) {
        return Object.fromEntries(
          Object.entries(handlers).map(([key, handler]) => [
            key,
            ((event: any) => {
              this.setModel(handler(event, this.model));
              this.render(this.model);
              return this.model;
            }) as EventHandler<Model>,
          ])
        ) as Handlers;
      }

      return {} as Handlers;
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
