export type IAttrHandler = ({ value }: { value: string }) => string;

export type ITemplateParams = Record<string, string>;

export function createComponent<T>({
  template,
  css,
  attrHandlers,
  shadowDomSettings = {
    mode: 'closed',
    delegatesFocus: true,
  },
}: {
  template: string | ((params: ITemplateParams) => string);
  css: string;
  attrHandlers?: Record<string, IAttrHandler>;
  shadowDomSettings?: ShadowRootInit;
}) {
  class Component extends HTMLElement {
    #shadowRoot: ShadowRoot;

    constructor() {
      super();

      this.#shadowRoot = this.attachShadow(shadowDomSettings);

      const attributes = getAttributes(this);

      console.log({ attributes });

      // TODO: get template params here
      const content = typeof template === 'function' ? template() : template;

      this.#shadowRoot.innerHTML = `<style>${css}</style>${content}`;
    }

    connectedCallback() {
      // console.log('Custom element added to page.');
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
      console.log(`Attribute ${attrName} changed from ${oldVal} to ${newVal}`);

      attrHandlers[attrName]({
        value: this.getAttribute(attrName),
      });

      // TODO: Use attrHandlers to apply changes to the DOM?
      // shadowRoot.querySelector('slot[name="${attrName}"]').textContent = value;
    }

    disconnectedCallback() {}
    adoptedCallback() {}
  }

  function getTemplateParams(component: HTMLAnchorElement) {
    //
  }

  function getAttributes(component: HTMLElement) {
    return Object.fromEntries(
      component.getAttributeNames().map((attrName) => {
        return [attrName, component.getAttribute(attrName)];
      })
    );
  }
  return Component;
}
