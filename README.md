# Functron

A lightweight functional interface for building Web Components with a clean, predictable state management pattern.

Still very experimental and not ready for real-world use!

## Features

- Functional approach to Web Components
- Simple state management with immutable updates
- TypeScript support out of the box
- Declarative event handling
- Virtual DOM powered by Snabbdom

## Install and Setup

```
$ npm install functron
```

Functron requires babel to compile .tsx files. This is currently only tested in Rollup. To set this up, you'll
need to install the Babel plugin and add some things to your `rollup.config.js`.

```
npm install @rollup/plugin-babel
```

### Modify your `rollup.config.js`

Add these lines:

```
import { babel } from '@rollup/plugin-babel';

export default {
  ...
  plugins: [
    babel({
      presets: ['@babel/preset-typescript', ['@babel/preset-react', { pragma: 'jsx', pragmaFrag: 'Fragment' }]],
      extensions: ['.ts', '.tsx'],
      babelHelpers: 'bundled',
    }),
  ],
};
```

### JSX Pragma

The JSX pragma is also required at the top of component files:

```
/** @jsx jsx */

// ... your component
```



## Quick Example

Here's a simple counter component:

```typescript
/** @jsx jsx */
import { createComponent, EventHandler, RenderFunc } from 'functron';

// Define the model interface
interface ICounterModel {
  count: number;
}

// Create event handlers
const handlers = {
  incrementCounter: (event: MouseEvent, model: ICounterModel) => ({
    ...model,
    count: model.count + 1,
  }),
};

// Define the render function
const render: RenderFunc<ICounterModel> = ({ count }, { incrementCounter }) => (
  <div>
    <button on={{ click: incrementCounter }}>Add 1</button>
    <div>{count}</div>
  </div>
);

// Create and register the component
createComponent({
  initialModel: { count: 0 },
  handlers,
  render,
})('my-counter');

// Use it in HTML
// <my-counter></my-counter>
```

## How It Works

1. Define your component's state model with TypeScript interfaces
1. Create pure event handlers that return new state
1. Write a render function that returns virtual DOM
1. Register your component with createComponent

The component will automatically re-render when the model changes, keeping your UI in sync with your data.
