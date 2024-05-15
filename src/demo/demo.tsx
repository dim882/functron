import { h, render } from 'preact';

import '../components/text-input/text-input';
import '../components/text-input/form';

const App = () => <h1>Hello World</h1>;

render(<App />, document.getElementById('app'));
