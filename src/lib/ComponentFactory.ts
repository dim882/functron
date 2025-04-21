import type { VNode } from 'snabbdom';
import * as CssUtils from './CssUtils';
import { patchDom } from './VirtualDom';

export { jsx } from './VirtualDom';

type AnyUIEvent = unknown extends UIEvent ? unknown : never;

export type EventHandler<Model, Event extends UIEvent = AnyUIEvent> = (event: Event, model: Model) => Model;

export type EventHandlerFactory<Model, Param, Event extends UIEvent = AnyUIEvent> = (
  param: Param
) => EventHandler<Model, Event>;

export type EventHandlerMap<Model, Param> = {
  [key: string]: EventHandlerFactory<Model, Param, AnyUIEvent>;
};

export type BoundEventHandler<Model, Event extends UIEvent = AnyUIEvent> = (event: Event, model: Model) => void;

export type RenderFunc<TModel, TParam, THandlers extends EventHandlerMap<TModel, TParam>> = (
  model: TModel,
  handlers: {
    [K in keyof THandlers]: (param: TParam) => BoundEventHandler<TModel, AnyUIEvent>;
  }
) => VNode;

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
  Param,
  Handlers extends EventHandlerMap<Model, Param>,
  Render extends RenderFunc<Model, Param, Handlers>
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
  Param,
  Handlers extends EventHandlerMap<Model, Param>,
  Render extends RenderFunc<Model, Param, Handlers>
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
}: ICreateComponentArgs<AttributeNames, Model, Param, Handlers, Render>): { new (): HTMLElement } {
  type Attributes = Record<AttributeNames[number], string>;

  type BoundEventHandlerMap = {
    [K in keyof Handlers]: (param: Param) => BoundEventHandler<Model, AnyUIEvent>;
  };

  class Component extends HTMLElement implements FunctronElement<Model> {
    public model: Model;
    public container: HTMLElement;
    #shadowRoot: ShadowRoot;
    public vdom: VNode | null = null;

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
      await CssUtils.applyCss(this.#shadowRoot, cssPath, css);
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

    bindHanders() {
      if (handlers) {
        return Object.fromEntries(
          Object.entries(handlers).map(([key, handler]) => [
            key,
            (param: Param) => {
              return ((event: AnyUIEvent) => {
                this.setModel(handler(param)(event, this.model));
                this.render(this.model);
                return this.model;
              }) as BoundEventHandler<Model>;
            },
          ])
        ) as BoundEventHandlerMap;
      }

      return {} as BoundEventHandlerMap;
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

  return Component as unknown as { new (): HTMLElement };
}
