import { useCallback, useEffect, useRef } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { useTabVisible } from '../hooks';
import '../styles/BackgroundParticles.scss';

function BackgroundParticles() {
  const containerRef = useRef(null);
  const tabVisible = useTabVisible();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    containerRef.current = container;
    if (!tabVisible) container.pause();
  }, [tabVisible]);

  useEffect(() => {
    if (!containerRef.current) return;
    tabVisible ? containerRef.current.play() : containerRef.current.pause();
  }, [tabVisible]);

  const particlesOptions = {
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: 'push'
        },
        onHover: {
          enable: true,
          mode: 'repulse',
          parallax: {
            enable: false,
            force: 60,
            smooth: 10
          }
        },
        resize: true
      },
      modes: {
        push: { quantity: 4 },
        repulse: {
          distance: 200,
          duration: 0.4
        }
      }
    },
    particles: {
      color: { value: '#1a1a1a' },
      move: {
        direction: 'none',
        enable: true,
        outModes: 'out',
        random: false,
        speed: 2,
        straight: false
      },
      number: {
        density: {
          enable: true,
          area: 800
        },
        value: 80
      },
      opacity: {
        animation: {
          enable: true,
          speed: 0.05,
          sync: true,
          startValue: 'random',
          count: 0,
          destroy: 'none',
          direction: 'alternate'
        },
        value: {
          min: 0.1,
          max: 0.5
        }
      },
      shape: { type: 'circle' },
      size: {
        value: {
          min: 1,
          max: 5
        }
      }
    }
  };

  return (
    <Particles
      id='background-particles'
      init={particlesInit}
      loaded={particlesLoaded}
      options={particlesOptions}
    />
  );
}

export default BackgroundParticles;
