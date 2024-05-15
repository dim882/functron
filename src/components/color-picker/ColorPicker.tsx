import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

const LchCircleCanvas = () => {
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

        ctx.fillStyle = 'red';

        ctx.beginPath();
        ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }, []);

  return <canvas ref={canvasRef} width={300} height={300} />;
};

export default LchCircleCanvas;
