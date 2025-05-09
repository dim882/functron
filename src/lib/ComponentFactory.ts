import type { VNode } from 'snabbdom';
import * as CssUtils from './CssUtils';
import { patchDom } from './VirtualDom';

export { jsx } from './VirtualDom';

type AnyUIEvent = unknown extends UIEvent ? unknown : never;

export type EventHandler<Model, Event extends UIEvent = AnyUIEvent> = (event: Event, model: Model) => Model;

export type EventHandlerFactory<Model, Param, Event extends UIEvent = AnyUIEvent> = (
  param: Param
) => EventHandler<Model, Event>;

export type EventHandlerOrFactory<Model, Param, Event extends UIEvent = AnyUIEvent> =
  | EventHandler<Model, Event>
  | EventHandlerFactory<Model, Param, Event>;

export type EventHandlerMap<Model, Param> = {
  [key: string]: EventHandlerOrFactory<Model, Param, AnyUIEvent>;
};

export type BoundEventHandler<Event extends UIEvent = AnyUIEvent> = (event: Event) => void;

// Conditional type for dealing with possible EventHandler or EventHandlerFactory
export type BoundHandlerMap<Handlers extends EventHandlerMap<Model, Param>, Model, Param> = {
  [Key in keyof Handlers]: Handlers[Key] extends EventHandlerFactory<Model, Param, infer Event>
    ? (param: Param) => BoundEventHandler<Event extends UIEvent ? Event : AnyUIEvent>
    : Handlers[Key] extends EventHandler<Model, infer Event>
    ? BoundEventHandler<Event extends UIEvent ? Event : AnyUIEvent>
    : never;
};

export type RenderFunc<TModel, TParam, THandlers extends EventHandlerMap<TModel, TParam>> = (
  model: TModel,
  handlers: BoundHandlerMap<THandlers, TModel, TParam>
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

  type BoundHandlerMapForRender = BoundHandlerMap<Handlers, Model, Param>;

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
      this.render(this.model);
      await CssUtils.applyCss(this.#shadowRoot, cssPath, css);
    }

    attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
      if (mapAttributesToModel) {
        const newModel = mapAttributesToModel(getAttributes(this), this.model);

        if (newModel !== this.model) {
          this.setModel(newModel);
          this.render(this.model);
        }
      }
    }

    disconnectedCallback() {
      disconnectedCallback?.(this);
    }

    adoptedCallback() {
      adoptedCallback?.(this);
    }

    setModel(newModel: Model) {
      if (typeof newModel === 'object' && newModel !== null && typeof this.model === 'object' && this.model !== null) {
        this.model = { ...this.model, ...newModel };
      } else {
        this.model = newModel;
      }
    }

    /**
     * For each handler, it determines if it's an `EventHandlerFactory` (which takes a `param`
     * and returns the actual event handler) or a direct `EventHandler`.
     *
     * It then creates a "bound" version of the handler function. This bound function, when
     * eventually called (typically by a DOM event):
     */
    bindHanders(): BoundHandlerMapForRender {
      const boundHandlers: Partial<BoundHandlerMapForRender> = {};

      if (handlers) {
        for (const key in handlers) {
          if (Object.prototype.hasOwnProperty.call(handlers, key)) {
            const originalHandler = handlers[key];
            const k = key as keyof Handlers;

            // If arity is 1, assume it's an EventHandlerFactory
            if (typeof originalHandler === 'function' && originalHandler.length === 1) {
              const factory = originalHandler as EventHandlerFactory<Model, Param, AnyUIEvent>;

              boundHandlers[k] = ((param: Param) => {
                const eventHandler = factory(param);

                return (event: AnyUIEvent) => {
                  const newModel = eventHandler(event, this.model);

                  if (newModel !== this.model) {
                    this.setModel(newModel);
                    this.render(this.model);
                  }
                };
              }) as BoundHandlerMapForRender[typeof k];
            } else {
              // It's a plain EventHandler
              const directHandler = originalHandler as EventHandler<Model, AnyUIEvent>;

              boundHandlers[k] = ((event: AnyUIEvent) => {
                const newModel = directHandler(event, this.model);

                if (newModel !== this.model) {
                  this.setModel(newModel);
                  this.render(this.model);
                }
              }) as BoundHandlerMapForRender[typeof k];
            }
          }
        }
      }

      return boundHandlers as BoundHandlerMapForRender;
    }
    render(model: Model) {
      const boundHandlers = this.bindHanders();
      const vdom = render(model, boundHandlers);

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
