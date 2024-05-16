import { h, render } from 'preact';
import ColorPicker from '../components/color-picker/ColorPicker';

import '../components/text-input/text-input';
import '../components/text-input/form';

const App = () => {
  const handleColorChange = (color: string) => {
    // console.log({ color });
  };
  return <ColorPicker onChange={handleColorChange} lch={[0, 0, 100]} />;
};

render(<App />, document.getElementById('app'));
