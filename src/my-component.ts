import { createComponent } from './component.fp.js';

const style = `
:host {
  display: block;
  border: 2px solid black;
  padding: 10px;
  font-family: sans-serif;
}

:host(:hover) ::slotted(div) {
  color: red;
}
`;

const dom = `
  <div>
    <input type="text" name="first_name"/>
    <br/>
    <slot name="title">Default Title</slot>
    <p><slot name="children">Default content.</slot></p>
  </div>
`;

createComponent({
  name: 'my-component',
  template: dom,
  css: style,
  attributes: ['name'],
});
