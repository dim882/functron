import { h, FunctionComponent } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import register from 'preact-custom-element';
import { drawColorWheel } from './ColorPicker.utils';

import styles from './ColorPicker.module.css';

interface IColorPickerProps {
  onChange: (color: string) => void;
  lch?: [number, number, number];
}

const ColorPicker: FunctionComponent<IColorPickerProps> = ({ onChange, lch }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState<string>('');
  const [lightness, setLightness] = useState<number>(50);
  const [coords, setCoords] = useState<[number, number]>([0, 0]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    drawColorWheel(canvasRef, lightness);
  }, [lightness]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const context = canvas.getContext('2d');
      handleColorChange(context, ...coords);
    }
  }, [lightness]);

  const handleLightnessInput: h.JSX.GenericEventHandler<HTMLInputElement> = (e) => {
    setLightness(parseInt(e.currentTarget.value));
  };

  const handleClick: h.JSX.MouseEventHandler<HTMLCanvasElement> = (event) => {
    const canvas = canvasRef.current;

    if (canvas) {
      const context = canvas.getContext('2d');

      if (context) {
        const { offsetX: x, offsetY: y } = event;
        setCoords([x, y]);

        handleColorChange(context, x, y);
      }
    }
  };

  function handleColorChange(context: CanvasRenderingContext2D, x: number, y: number) {
    const imageData = context.getImageData(x, y, 1, 1).data;
    const rgbColor = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;

    setColor(rgbColor);
    onChange(rgbColor);
  }

  const handlePointerDown: h.JSX.PointerEventHandler<HTMLCanvasElement> = (event) => {
    setIsDragging(true);
    moveCircle(event);
  };

  const handlePointerMove: h.JSX.PointerEventHandler<HTMLCanvasElement> = (event) => {
    if (isDragging) {
      moveCircle(event);
    }
  };

  const handlePointerUp: h.JSX.PointerEventHandler<HTMLCanvasElement> = () => {
    setIsDragging(false);
  };

  const moveCircle = (event: h.JSX.TargetedPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;

    if (canvas) {
      const context = canvas.getContext('2d');

      if (context) {
        const imageData = context.getImageData(...coords, 1, 1).data;
        const rgbColor = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;

        setColor(rgbColor);
        onChange(rgbColor);

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setCoords([x, y]);

        handleColorChange(context, x, y);

        if (circleRef.current) {
          console.log('setting circleRef');

          circleRef.current.style.left = `${x - 10}px`;
          circleRef.current.style.top = `${y - 10}px`;
        }
      }
    }
  };
  console.log(coords);

  return (
    <div className={styles.root}>
      <div className={styles.leftColumn}>
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className={styles.canvas}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
        <div
          ref={circleRef}
          className={styles.selectionCircle}
          style={{ left: `${coords[0] - 10}px`, top: `${coords[1] - 10}px` }}
        />

        <div style={{ backgroundColor: color }} className={styles.colorSwatch}></div>
        <input type="text" value={color} />
      </div>

      <div className={styles.rightColumn}>
        <label for="lightness" className={styles.labelLightness}>
          Lightness
        </label>
        <input
          className={styles.lightness}
          type="range"
          id="lightness"
          min="0"
          max="100"
          value={lightness}
          onInput={handleLightnessInput}
        />
      </div>
    </div>
  );
};

register(ColorPicker, 'color-picker', [], { shadow: true });

export default ColorPicker;
