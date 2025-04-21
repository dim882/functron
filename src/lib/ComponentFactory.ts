import type { VNode } from 'snabbdom';
import * as CssUtils from './CssUtils';
import { patchDom } from './VirtualDom';

export { jsx } from './VirtualDom';

type AnyUIEvent = unknown extends UIEvent ? unknown : never;

export type EventHandler<Model, Event extends UIEvent = AnyUIEvent> = (event: Event, model: Model) => Model;

export type EventHandlerFactory<Model, Param, Event extends UIEvent = AnyUIEvent> = (
  param: Param
) => EventHandler<Model, Event>;

export type AnyEventHandler<Model, Param, Event extends UIEvent = AnyUIEvent> =
  | EventHandler<Model, Event>
  | EventHandlerFactory<Model, Param, Event>;

export type EventHandlerMap<Model, Param> = {
  [key: string]: AnyEventHandler<Model, Param, AnyUIEvent>;
};

export type BoundEventHandler<Event extends UIEvent = AnyUIEvent> = (event: Event) => void;

export type RenderFunc<TModel, TParam, THandlers extends EventHandlerMap<TModel, TParam>> = (
  model: TModel,
  handlers: {
    [K in keyof THandlers]: THandlers[K] extends EventHandlerFactory<TModel, TParam, infer E>
      ? (param: TParam) => BoundEventHandler<E extends UIEvent ? E : AnyUIEvent>
      : THandlers[K] extends EventHandler<TModel, infer E>
      ? BoundEventHandler<E extends UIEvent ? E : AnyUIEvent>
      : never;
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

  type BoundHandlerMapForRender = {
    [K in keyof Handlers]: Handlers[K] extends EventHandlerFactory<Model, Param, infer E>
      ? (param: Param) => BoundEventHandler<E extends UIEvent ? E : AnyUIEvent>
      : Handlers[K] extends EventHandler<Model, infer E>
      ? BoundEventHandler<E extends UIEvent ? E : AnyUIEvent>
      : never;
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
     * Creates and binds event handlers defined in the component configuration.
     *
     * This method iterates through the `handlers` object provided to `createComponent`.
     * For each handler, it determines if it's an `EventHandlerFactory` (which takes a `param`
     * and returns the actual event handler) or a direct `EventHandler`.
     *
     * It then creates a "bound" version of the handler function. This bound function, when
     * eventually called (typically by a DOM event):
     * 1. Executes the original handler logic (either the direct handler or the one returned by the factory).
     * 2. Takes the new model returned by the original handler.
     * 3. Updates the component's state using `this.setModel()` if the model has changed.
     * 4. Triggers a component re-render using `this.render()` if the model has changed.
     *
     * The method returns an object (`BoundHandlerMapForRender`) where:
     * - Keys are the original handler names.
     * - Values are the functions that should be used within the `render` function:
     *   - If the original handler was a factory, the value is a function that takes the `param`
     *     and returns the final `BoundEventHandler` (the function to attach to the event listener).
     *   - If the original handler was a direct handler, the value *is* the final `BoundEventHandler`.
     *
     * This mechanism decouples the pure handler logic from the component's state management
     * and rendering side effects, providing a clean interface for the `render` function.
     *
     * Note: It uses the function's `length` property as a runtime heuristic to differentiate
     * between factories (expected length 1) and direct handlers (expected length > 1 or 0).
     * Type assertions (`as`) are used during assignment because TypeScript cannot fully infer
     * the complex conditional types within the loop's control flow based on this heuristic.
     *
     * @returns {BoundHandlerMapForRender} An object mapping handler names to the functions usable in the render method.
     */
    bindHanders(): BoundHandlerMapForRender {
      // Start with Partial as the object is built incrementally
      const boundHandlers: Partial<BoundHandlerMapForRender> = {};

      if (handlers) {
        for (const key in handlers) {
          // Ensure it's an own property before processing
          if (Object.prototype.hasOwnProperty.call(handlers, key)) {
            const originalHandler = handlers[key];

            // Assert key type for indexing into boundHandlers and Handlers
            const k = key as keyof Handlers;

            // Heuristic: Check function arity (length)
            if (typeof originalHandler === 'function' && originalHandler.length === 1) {
              // Assume it's an EventHandlerFactory
              const factory = originalHandler as EventHandlerFactory<Model, Param, AnyUIEvent>;

              // Create the function that takes 'param' and returns the final listener.
              // Assert that this assignment matches the expected type for this specific key 'k'.
              boundHandlers[k] = ((param: Param) => {
                const eventHandler = factory(param);

                // The final event listener function
                return (event: AnyUIEvent) => {
                  const newModel = eventHandler(event, this.model);

                  if (newModel !== this.model) {
                    this.setModel(newModel);
                    this.render(this.model);
                  }
                };
                // Cast the outer function to the specific type expected for this key k
              }) as BoundHandlerMapForRender[typeof k]; // <-- Assertion added/corrected
            } else if (typeof originalHandler === 'function') {
              // Assume it's a direct EventHandler
              const directHandler = originalHandler as EventHandler<Model, AnyUIEvent>;

              // Create the final event listener directly.
              // Assert that this assignment matches the expected type for this specific key 'k'.
              boundHandlers[k] = ((event: AnyUIEvent) => {
                const newModel = directHandler(event, this.model);

                if (newModel !== this.model) {
                  this.setModel(newModel);
                  this.render(this.model);
                }
                // Cast this function to the specific type expected for this key k
              }) as BoundHandlerMapForRender[typeof k];
            }
          }
        }
      }

      // Cast the final potentially partial object to the complete type.
      // This assumes all valid handlers defined in Handlers were processed.
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
