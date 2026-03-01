import type { VNode } from 'snabbdom';

// -- Unified handler type: always a factory --
// (...args) => (event, model) => Model
// Direct handlers take no args: () => (event, model) => Model

export type Handler<Model, Args extends unknown[] = [], E extends Event = Event> =
  (...args: Args) => (event: E, model: Model) => Model;

export type HandlerMap<Model> = {
  [key: string]: (...args: any[]) => (event: any, model: Model) => Model;
};

export type BoundHandlerMap<H extends HandlerMap<Model>, Model> = {
  [K in keyof H]: H[K] extends (...args: infer A) => (event: infer E, model: any) => any
    ? (...args: A) => (event: E) => void
    : never;
};

// -- Render --

export type RenderFunc<Model = {}, Handlers extends HandlerMap<Model> = HandlerMap<Model>> = (
  model: Model,
  handlers: BoundHandlerMap<Handlers, Model>,
) => VNode;

// -- Component config (SPA) --

export interface ComponentConfig<
  Model,
  Handlers extends HandlerMap<Model> = HandlerMap<Model>,
> {
  initialModel: Model;
  handlers?: Handlers;
  render: RenderFunc<Model, Handlers>;
}

// -- FunctronInstance (return type of createComponent) --

export interface FunctronInstance<Model> {
  mount(container: Element): void;
  unmount(): void;
  getModel(): Model;
  setModel(model: Model): void;
}

// -- Web component config --

export interface WebComponentConfig<
  Model,
  Handlers extends HandlerMap<Model> = HandlerMap<Model>,
  AttributeNames extends string[] = string[],
> extends ComponentConfig<Model, Handlers> {
  attributes?: AttributeNames;
  shadowDomSettings?: ShadowRootInit;
  mapAttributesToModel?: (
    attributes: Record<AttributeNames[number], string>,
    model: Model,
  ) => Model;
  connectedCallback?: (element: FunctronElement<Model>) => void;
  disconnectedCallback?: (element: FunctronElement<Model>) => void;
  adoptedCallback?: (element: HTMLElement) => void;
}

// -- FunctronElement (web component interface) --

export interface FunctronElement<Model> extends HTMLElement {
  setModel: (newModel: Model) => void;
  model: Model;
}
