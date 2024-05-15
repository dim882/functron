import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

const ColorPicker = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

            const x = width / 2 + Math.cos((angle * Math.PI) / 180) * r;
            const y = height / 2 + Math.sin((angle * Math.PI) / 180) * r;

            ctx.fillRect(x - 1, y - 1, 2.2, 2.2);
          }
        }
      }
    }
  }, []);

  return <canvas ref={canvasRef} width={300} height={300} />;
};

export default ColorPicker;
