import { useCallback, useEffect, useRef, useState } from 'react';
import '../styles/BackgroundStatic.scss';

function BackgroundStatic({ footerRef }) {
  const animationRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      const { width, height } = footerRef.current.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };

    const noiseMaker = () => {
      const { width, height } = canvas;
      const imageData = ctx.createImageData(width, height);
      const { data } = imageData;

      for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i+1] = data[i+2] = Math.random() * 255; // rgb
        data[i+3] = 255; // alpha
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const staticAnimation = () => {
      noiseMaker();
      animationRef.current = requestAnimationFrame(staticAnimation);
    };

    handleResize();
    staticAnimation();

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas id='background-static' ref={canvasRef} />
  );
}

export default BackgroundStatic;
