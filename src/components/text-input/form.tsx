import { createDecoratedComponent } from '../../lib/createComponent.decorated';
import { h } from '../../lib/snabbdomHelper';

const MyComponent = createDecoratedComponent({
  constructor: () => {},
  cssPath: './form.css',
  render: (state) => (
    <form>
      <ui-text-input fieldname="firstname" value="Joseph Schmoe">
        <div slot="label">Custom Label</div>
        <div slot="message">Do something!</div>
      </ui-text-input>
    </form>
  ),
});

customElements.define('ui-form', MyComponent);
