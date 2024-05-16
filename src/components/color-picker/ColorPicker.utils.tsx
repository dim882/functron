export function drawColorWheel(canvasRef, lightness: number) {
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
}

export function lchToXy(lch: [number, number, number], canvasWidth: number, canvasHeight: number): [number, number] {
  console.log({ canvasWidth, canvasHeight });

  const [_, c, h] = lch;
  console.log({ c, h });

  const radius = Math.min(canvasWidth, canvasHeight) / 2;
  const angle = (h * Math.PI) / 180; // Convert hue to radians
  const x = radius + c * Math.cos(angle);
  const y = radius - c * Math.sin(angle); // Canvas y-axis is inverted
  return [x, y];
}
