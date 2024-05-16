import { h, FunctionComponent } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import register from 'preact-custom-element';

interface IColorPickerProps {
  onChange: (color: string) => void;
}

const ColorPicker: FunctionComponent<IColorPickerProps> = ({ onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState<string>('');
  const [lightness, setLightness] = useState<number>(50);

  const handleLightnessChange: h.JSX.EventHandler = (e) => {
    setLightness(e.target.value);
  };

  const handleClick: h.JSX.MouseEventHandler<HTMLCanvasElement> = (event) => {
    const canvas = canvasRef.current;

    if (canvas) {
      const context = canvas.getContext('2d');

      if (context) {
        const x = event.offsetX;
        const y = event.offsetY;
        const imageData = context.getImageData(x, y, 1, 1).data;
        const rgbColor = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;

        onChange(rgbColor);
        setColor(rgbColor);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');

      if (ctx) {
        const { width, height } = canvas;
        const radius = Math.min(width, height) / 2;

        ctx.clearRect(0, 0, width, height);

        for (let angle = 0; angle < 360; angle++) {
          for (let r = 0; r < radius; r++) {
            const h = angle;
            const c = (r / radius) * 100;
            const l = lightness;

            ctx.fillStyle = `lch(${l}% ${c} ${h}deg)`;

            // Bring the dimensions in a bit to account for the rects that are bigger than 1x1
            const x = (width - 2) / 2 + Math.cos((angle * Math.PI) / 180) * r + 1;
            const y = (height - 2) / 2 + Math.sin((angle * Math.PI) / 180) * r + 1;

            // Make the rects bigger than 1x1, to avoid moire patterns
            ctx.fillRect(x - 1, y - 1, 2.2, 2.2);
          }
        }
      }
    }
  }, [lightness]);
  console.log({ lightness });

  return (
    <div>
      <canvas ref={canvasRef} width={300} height={300} onClick={handleClick} />

      <label for="lightness">Lightness</label>
      <input
        type="range"
        id="lightness"
        name="lightness"
        min="0"
        max="100"
        value={lightness}
        onChange={handleLightnessChange}
      />

      <div style={{ backgroundColor: color, width: 200 }}>{color}</div>
    </div>
  );
};

register(ColorPicker, 'color-picker', [], { shadow: true });

export default ColorPicker;
