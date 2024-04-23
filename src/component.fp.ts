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

    static get observedAttributes() {
      return Object.keys(attrHandlers);
    }

    constructor() {
      console.log('--- constructor');

      super();

      this.#shadowRoot = this.attachShadow(shadowDomSettings);
    }

    connectedCallback() {
      console.log('--- connectedCallback');
      const templateParams = getAttributes(this);
      const content = typeof template === 'function' ? template(templateParams) : template;
      this.#shadowRoot.innerHTML = `<style>${css}</style>${content}`;
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
      console.log(`--- attributeChangedCallback Attribute ${attrName} changed from ${oldVal} to ${newVal}`);
    }

    disconnectedCallback() {}

    adoptedCallback() {}
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
