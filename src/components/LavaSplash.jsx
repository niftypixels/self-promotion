import { useEffect, useRef } from 'react';

const LAVA_COLORS = [
  '#ff2200', '#ff3300', '#ff4500', '#ff5500',
  '#ff6600', '#ff7700', '#ff8800', '#ff9900',
  '#ffaa00', '#ffcc00', '#e02000', '#cc1a00'
];

function createSplashParticles(x, y) {
  const particles = [];

  // Main upward burst — small fast droplets
  for (let i = 0; i < 18; i++) {
    const spread = (Math.random() - 0.5) * Math.PI * 0.7;
    const angle = -Math.PI / 2 + spread;
    const speed = 2 + Math.random() * 6;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 1.5 + Math.random() * 2.5,
      color: LAVA_COLORS[Math.floor(Math.random() * LAVA_COLORS.length)],
      life: 1.0,
      decay: 0.018 + Math.random() * 0.020,
      gravity: 0.30
    });
  }

  // Crown jets — sideways splatter at the base
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 5; i++) {
      const angle = side * (Math.PI * 0.04 + Math.random() * Math.PI * 0.25);
      const speed = 2 + Math.random() * 5;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: -(Math.random() * 2.5 + 0.5),
        size: 1.5 + Math.random() * 2,
        color: LAVA_COLORS[Math.floor(Math.random() * LAVA_COLORS.length)],
        life: 1.0,
        decay: 0.020 + Math.random() * 0.022,
        gravity: 0.22
      });
    }
  }

  // Large slow blobs — heavy viscous lava
  for (let i = 0; i < 4; i++) {
    const spread = (Math.random() - 0.5) * Math.PI * 0.45;
    const angle = -Math.PI / 2 + spread;
    const speed = 1.5 + Math.random() * 3.5;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 4 + Math.random() * 5,
      color: LAVA_COLORS[Math.floor(Math.random() * 4)],
      life: 1.0,
      decay: 0.012 + Math.random() * 0.010,
      gravity: 0.14
    });
  }

  // Ember sparks — tiny bright specks that fly far
  for (let i = 0; i < 10; i++) {
    const spread = (Math.random() - 0.5) * Math.PI * 0.9;
    const angle = -Math.PI / 2 + spread;
    const speed = 4 + Math.random() * 7;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 0.8 + Math.random() * 1.2,
      color: Math.random() > 0.4 ? '#fff8c0' : '#ffdd44',
      life: 1.0,
      decay: 0.022 + Math.random() * 0.020,
      gravity: 0.18
    });
  }

  return particles;
}

function LavaSplash({ splash }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const startAnimRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.993;
        p.life -= p.decay;

        const alpha = Math.max(0, p.life);
        const radius = p.size * (0.5 + alpha * 0.5);

        // outer glow
        ctx.globalAlpha = alpha * 0.3;
        ctx.shadowBlur = 0;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 1.6, 0, Math.PI * 2);
        ctx.fill();

        // core with inner glow
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = radius * 2;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.size > 5 ? '#ffeecc' : p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (particlesRef.current.length > 0) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        animFrameRef.current = null;
      }
    };

    startAnimRef.current = () => {
      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!splash) return;
    particlesRef.current = [...particlesRef.current, ...createSplashParticles(splash.x, splash.y)];
    startAnimRef.current?.();
  }, [splash]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 50
      }}
    />
  );
}

export default LavaSplash;
