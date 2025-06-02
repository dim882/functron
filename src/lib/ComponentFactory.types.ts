import type { VNode } from 'snabbdom';

export type AnyUIEvent = unknown extends UIEvent ? unknown : never;

export type EventHandler<Model, Event extends UIEvent = AnyUIEvent> = (event: Event, model: Model) => Model;

export type EventHandlerFactory<Model, Param, Event extends UIEvent = AnyUIEvent> = (
  param: Param
) => EventHandler<Model, Event>;

export type EventHandlerOrFactory<Model, Event extends UIEvent = AnyUIEvent> =
  | EventHandler<Model, Event>
  | EventHandlerFactory<Model, any, Event>;

export type EventHandlerMap<Model> = {
  [key: string]: EventHandlerOrFactory<Model>;
};

export type BoundEventHandler<Event extends UIEvent = AnyUIEvent> = (event: Event) => void;

// Conditional type for dealing with possible EventHandler or EventHandlerFactory
export type BoundHandlerMap<Handlers extends EventHandlerMap<Model>, Model> = {
  [Key in keyof Handlers]: Handlers[Key] extends EventHandler<Model, infer Event>
    ? BoundEventHandler<Event extends UIEvent ? Event : AnyUIEvent>
    : Handlers[Key] extends EventHandlerFactory<Model, infer Param, infer Event>
      ? (param: Param) => BoundEventHandler<Event extends UIEvent ? Event : AnyUIEvent>
      : never;
};

export type RenderFunc<TModel = {}, THandlers extends EventHandlerMap<TModel> = {}> = (
  model: TModel,
  handlers: BoundHandlerMap<THandlers, TModel>
) => VNode;

type AttributeChangeCallback<Model> = (instance: FunctronElement<Model>, attrName: string, oldVal: string, newVal: string) => void;

export type StandardComponentArgs<AttributeNames, Model> = {
  connectedCallback?: (instance: FunctronElement<Model>) => void;
  disconnectedCallback?: (instance: FunctronElement<Model>) => void;
  attributeChangedCallback?: AttributeChangeCallback<Model>;
  adoptedCallback?: (element: HTMLElement) => void;
  shadowDomSettings?: ShadowRootInit;
  attributes?: AttributeNames;
};

export interface ICreateComponentArgs<
  Model,
  Handlers extends EventHandlerMap<Model>,
  Render extends RenderFunc<Model, Handlers>,
  AttributeNames extends string[],
> extends StandardComponentArgs<AttributeNames, Model> {
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