import type { VNode } from 'snabbdom';
import * as CssUtils from './CssUtils';
import { patchDom } from './VirtualDom';
import type {
  EventHandler,
  EventHandlerFactory,
  EventHandlerMap,
  BoundHandlerMap,
  RenderFunc,
  ICreateComponentArgs,
  FunctronElement,
  AnyUIEvent
} from './ComponentFactory.types';

export { jsx } from './VirtualDom';

export function createComponent<
  Model,
  Handlers extends EventHandlerMap<Model> = EventHandlerMap<Model>,
  Render extends RenderFunc<Model, Handlers> = RenderFunc<Model, Handlers>,
  AttributeNames extends string[] = [],
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
  connectedCallback,
  handlers,
}: ICreateComponentArgs<Model, Handlers, Render, AttributeNames >): { new (): HTMLElement } {
  type Attributes = Record<AttributeNames[number], string>;
  type BoundHandlerMapForRender = BoundHandlerMap<Handlers, Model>;

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

      connectedCallback?.(this);
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
    bindHandlers(): BoundHandlerMapForRender {
      const boundHandlers: Partial<BoundHandlerMapForRender> = {};

      if (handlers) {
        for (const key in handlers) {
          if (Object.prototype.hasOwnProperty.call(handlers, key)) {
            const originalHandler = handlers[key];

            // If arity is 1, assume it's an EventHandlerFactory
            if (typeof originalHandler === 'function' && originalHandler.length === 1) {
              const factory = originalHandler as EventHandlerFactory<Model, unknown, AnyUIEvent>;

              boundHandlers[key] = ((param: unknown) => {
                const eventHandler = factory(param);

                return (event: AnyUIEvent) => {
                  const newModel = eventHandler(event, this.model);

                  if (newModel !== this.model) {
                    this.setModel(newModel);
                    this.render(this.model);
                  }
                };
              }) as BoundHandlerMapForRender[typeof key];
            } else {
              // It's a plain EventHandler
              const directHandler = originalHandler as EventHandler<Model, AnyUIEvent>;

              boundHandlers[key] = ((event: AnyUIEvent) => {
                const newModel = directHandler(event, this.model);

                if (newModel !== this.model) {
                  this.setModel(newModel);
                  this.render(this.model);
                }
              }) as BoundHandlerMapForRender[typeof key];
            }
          }
        }
      }

      return boundHandlers as BoundHandlerMapForRender;
    }
    render(model: Model) {
      const boundHandlers = this.bindHandlers();
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
