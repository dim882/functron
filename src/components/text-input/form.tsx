/** @jsx h */
import { createDecoratedComponent } from '../../lib/createComponent.decorated';
import { h } from '../../lib/snabbdomHelper';

const MyComponent = createDecoratedComponent({
  cssPath: './form.css',
  render: (state) => (
    <form>
      <ui-text-input attrs={{ fieldname: 'firstname', value: 'Joseph Schmoe' }}>
        <div slot="label">Custom Label</div>
        <div slot="message">Do something!</div>
      </ui-text-input>
      foo
      <ui-text-input attrs={{ fieldname: 'firstname', value: 'Joseph Schmoe' }}></ui-text-input>
    </form>
  ),
});

customElements.define('ui-form', MyComponent);
