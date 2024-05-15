import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

const ColorPicker = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState<string>('');
  const handleClick: h.JSX.MouseEventHandler<HTMLCanvasElement> = (event) => {
    const canvas = canvasRef.current;

    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const imageData = context.getImageData(x, y, 1, 1).data;
        const rgbaColor = `rgba(${imageData[0]}, ${imageData[1]}, ${imageData[2]}, ${imageData[3] / 255})`;
        setColor(rgbaColor);
        console.log(`Color at (${x}, ${y}): ${rgbaColor}`);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');

      if (ctx) {
        const width = canvas.width;
        const height = canvas.height;
        const radius = Math.min(width, height) / 2;

        ctx.clearRect(0, 0, width, height);

        for (let angle = 0; angle < 360; angle++) {
          for (let r = 0; r < radius; r++) {
            const h = angle;
            const c = (r / radius) * 100;
            const l = 50;

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
  }, []);

  return <canvas ref={canvasRef} width={300} height={300} onClick={handleClick} />;
};

export default ColorPicker;
