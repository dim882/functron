import { jsx, Fragment, VNode } from 'snabbdom';
import { createComponent } from '../../lib/createComponent.base';
import { h } from '../../lib/snabbdomHelper';

const MyComponent = createComponent({
  cssPath: './form.css',
  shadowDomSettings: {
    mode: 'open',
  },
  render: (state) => (
    <form>
      <ui-text-input attrs={{ fieldname: 'firstname', value: 'Joseph Schmoe' }}>
        <div slot="label">Custom Label</div>
        <div slot="message">Do something!</div>
      </ui-text-input>
    </form>
  ),
});

customElements.define('ui-form', MyComponent);
