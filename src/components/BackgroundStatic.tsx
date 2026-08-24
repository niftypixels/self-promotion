import { useEffect, useRef } from 'react';
import { useInterval, useTabVisible } from '../hooks';
import '../styles/BackgroundStatic.scss';

interface BackgroundStaticProps {
  fps?: number;
}

function BackgroundStatic({ fps = 60 }: BackgroundStaticProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tabVisible = useTabVisible();

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current!;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width / 3;
      canvas.height = height;
    };

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useInterval(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const { data } = imageData;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i+1] = data[i+2] = Math.random() * 222;
      data[i+3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
  }, tabVisible ? 1000 / fps : null);

  return (
    <canvas id='background-static' ref={canvasRef} />
  );
}

export default BackgroundStatic;
