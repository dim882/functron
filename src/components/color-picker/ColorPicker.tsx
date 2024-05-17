import { h, FunctionComponent } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import register from 'preact-custom-element';
import { drawColorWheel, lchToXy } from './ColorPicker.utils';

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

  useEffect(() => drawColorWheel(canvasRef, lightness), [lightness]);

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

  function handleColorChange(context: CanvasRenderingContext2D, x: number, y: number) {
    const imageData = context.getImageData(x, y, 1, 1).data;
    const rgbColor = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;

    setCoords([x, y]);
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
    const context = canvasRef.current.getContext('2d');
    const { offsetX: x, offsetY: y } = event;

    handleColorChange(context, x, y);
  };

  // Handle initial color from prop
  useEffect(() => {
    if (lch) {
      setLightness(lch[0]);

      if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        const [x, y] = lchToXy(lch, context.canvas.width, context.canvas.height);

        handleColorChange(context, x, y);
      }
    }
  }, [lch]);

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
        <div ref={circleRef} className={styles.selectionCircle} style={{ left: coords[0], top: coords[1] }} />

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
