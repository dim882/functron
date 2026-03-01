import type { VNode } from 'snabbdom';
import { patchDom } from './VirtualDom';
import type {
  HandlerMap,
  BoundHandlerMap,
  ComponentConfig,
  WebComponentConfig,
  FunctronInstance,
  FunctronElement,
  RenderFunc,
} from './ComponentFactory.types';

export { jsx } from './VirtualDom';

// --- Shared functional utilities ---

function bindHandlers<Model, Handlers extends HandlerMap<Model>>(
  handlers: Handlers | undefined,
  getModel: () => Model,
  update: (model: Model) => void,
): BoundHandlerMap<Handlers, Model> {
  const bound: Record<string, unknown> = {};
  if (handlers) {
    for (const key in handlers) {
      if (Object.prototype.hasOwnProperty.call(handlers, key)) {
        const factory = handlers[key]!;
        bound[key] = (...args: unknown[]) => {
          const handler = factory(...args);
          return (event: Event) => {
            const current = getModel();
            const newModel = handler(event, current);
            if (newModel !== current) {
              update(newModel);
            }
          };
        };
      }
    }
  }
  return bound as BoundHandlerMap<Handlers, Model>;
}

function renderVdom<Model, Handlers extends HandlerMap<Model>>(
  container: Element,
  prevVdom: VNode | null,
  renderFn: RenderFunc<Model, Handlers>,
  model: Model,
  boundHandlers: BoundHandlerMap<Handlers, Model>,
): VNode {
  const newVdom = renderFn(model, boundHandlers);
  patchDom(prevVdom ?? container, newVdom);
  return newVdom;
}

// --- SPA component ---

export function createComponent<
  Model,
  Handlers extends HandlerMap<Model> = HandlerMap<Model>,
>({ initialModel, handlers, render }: ComponentConfig<Model, Handlers>): FunctronInstance<Model> {
  let model = initialModel;
  let vdom: VNode | null = null;
  let container: Element | null = null;

  function doRender() {
    if (!container) return;
    const bound = bindHandlers(handlers, () => model, (m) => { model = m; doRender(); });
    vdom = renderVdom(container, vdom, render, model, bound);
  }

  return {
    mount(el) { container = el; doRender(); },
    unmount() { vdom = null; container = null; },
    getModel() { return model; },
    setModel(m) { model = m; doRender(); },
  };
}

// --- Web component ---

export function createWebComponent<
  Model,
  Handlers extends HandlerMap<Model> = HandlerMap<Model>,
  AttributeNames extends string[] = string[],
>(config: WebComponentConfig<Model, Handlers, AttributeNames>): { new (): FunctronElement<Model> } {
  type Attributes = Record<AttributeNames[number], string>;
  const {
    initialModel, handlers, render, attributes,
    shadowDomSettings = { mode: 'closed' },
    mapAttributesToModel, connectedCallback,
    disconnectedCallback, adoptedCallback,
  } = config;

  class Component extends HTMLElement implements FunctronElement<Model> {
    model: Model = initialModel;
    #container: HTMLElement;
    #shadowRoot: ShadowRoot;
    #vdom: VNode | null = null;

    static get observedAttributes() { return attributes ?? []; }

    constructor() {
      super();
      this.#shadowRoot = this.attachShadow(shadowDomSettings);
      this.#container = document.createElement('div');
      this.#shadowRoot.appendChild(this.#container);
    }

    connectedCallback() {
      this.#render();
      connectedCallback?.(this as unknown as FunctronElement<Model>);
    }

    disconnectedCallback() {
      disconnectedCallback?.(this as unknown as FunctronElement<Model>);
    }

    adoptedCallback() {
      adoptedCallback?.(this);
    }

    attributeChangedCallback(_name: string, _oldVal: string, _newVal: string) {
      if (mapAttributesToModel) {
        const attrs = getAttributes(this);
        const newModel = mapAttributesToModel(attrs, this.model);
        if (newModel !== this.model) {
          this.setModel(newModel);
        }
      }
    }

    setModel(newModel: Model) {
      this.model = newModel;
      this.#render();
    }

    #render() {
      const bound = bindHandlers(handlers, () => this.model, (m) => {
        this.model = m;
        this.#render();
      });
      this.#vdom = renderVdom(this.#container, this.#vdom, render, this.model, bound);
    }
  }

  function getAttributes(el: HTMLElement): Attributes {
    return Object.fromEntries(
      el.getAttributeNames().map((n) => [n, el.getAttribute(n)]),
    ) as Attributes;
  }

  return Component as unknown as { new (): FunctronElement<Model> };
}
