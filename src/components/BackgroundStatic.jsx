import { useEffect, useRef } from 'react';
import { useInterval } from '../hooks';
import '../styles/BackgroundStatic.scss';

function BackgroundStatic({ fps = 60 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const resizeCanvas = () => {
      const { width, height } = canvasRef.current.getBoundingClientRect();
      canvasRef.current.width = width / 3;
      canvasRef.current.height = height;
    };

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useInterval(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const { data } = imageData;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i+1] = data[i+2] = Math.random() * 222; // rgb
      data[i+3] = 255; // alpha
    }

    ctx.putImageData(imageData, 0, 0);
  }, 1000 / fps);

  return (
    <canvas id='background-static' ref={canvasRef} />
  );
}

export default BackgroundStatic;
