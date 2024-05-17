import { h, render } from 'preact';
import ColorPicker from '../components/color-picker/ColorPicker';

// import '../components/text-input/text-input';
// import '../components/text-input/form';
import '../components/hello-vdom/hello-vdom';

const App = () => {
  const handleColorChange = (color: string) => {
    // console.log({ color });
  };
  return <ColorPicker onChange={handleColorChange} lch={[60, 140, 10]} />;
};

render(<App />, document.getElementById('app'));
