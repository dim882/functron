import { h, render } from 'preact';
import ColorPicker from '../components/color-picker/ColorPicker';

import '../components/text-input/text-input';
import '../components/text-input/form';

const App = () => {
  return <ColorPicker />;
};

render(<App />, document.getElementById('app'));
