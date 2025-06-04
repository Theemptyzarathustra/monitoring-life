import React, { useRef, useEffect } from 'react';

const BLOCKS = 36;
const SIZE = { min: 18, max: 54 };
const SPEED = 0.6;

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomColor() {
  // HSL dengan saturasi dan lightness tinggi agar warna unik dan cerah
  const h = Math.floor(Math.random() * 360);
  const s = random(60, 90);
  const l = random(60, 80);
  return `hsl(${h},${s}%,${l}%)`;
}

const MovingBlocksBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blocks = useRef(
    Array.from({ length: BLOCKS }).map(() => ({
      x: random(0, window.innerWidth),
      y: random(0, window.innerHeight),
      size: random(SIZE.min, SIZE.max),
      color: randomColor(),
      dx: random(-SPEED, SPEED),
      dy: random(-SPEED, SPEED),
      alpha: random(0.18, 0.38),
      border: random(0.5, 1.5),
    }))
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId: number;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const block of blocks.current) {
        ctx.save();
        ctx.globalAlpha = block.alpha;
        ctx.fillStyle = block.color;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = block.border;
        ctx.fillRect(block.x, block.y, block.size, block.size);
        ctx.strokeRect(block.x, block.y, block.size, block.size);
        ctx.restore();
        // Move
        block.x += block.dx;
        block.y += block.dy;
        // Bounce
        if (block.x < 0 || block.x + block.size > canvas.width) block.dx *= -1;
        if (block.y < 0 || block.y + block.size > canvas.height) block.dy *= -1;
      }
      animationId = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default MovingBlocksBackground; 