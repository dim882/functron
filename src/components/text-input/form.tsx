import { createDecoratedComponent } from '../../lib/createComponent.decorated';
import { h } from '../../lib/snabbdomHelper';

const MyComponent = createDecoratedComponent({
  cssPath: './form.css',
  render: (state) => (
    <form>
      <button id="delete-button">Delete text-input shadow DOM</button>

      <ui-text-input fieldname="firstname" value="Joseph Schmoe">
        <div slot="label">Custom Label</div>
        <div slot="message">Do something!</div>
      </ui-text-input>
    </form>
  ),
});

customElements.define('ui-form', MyComponent);
