import { useCallback, useEffect, useRef } from 'react';
import Particles from 'react-tsparticles';
import type { IOptions, RecursivePartial } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';
import { useTabVisible } from '../hooks';
import '../styles/BackgroundParticles.scss';

function BackgroundParticles() {
  const containerRef = useRef<Awaited<ReturnType<typeof loadSlim>> | null>(null);
  const tabVisible = useTabVisible();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const particlesLoaded = useCallback(async (container: any) => {
    containerRef.current = container;
    if (!tabVisible) container.pause();
  }, [tabVisible]);

  useEffect(() => {
    if (!containerRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tabVisible ? (containerRef.current as any).play() : (containerRef.current as any).pause();
  }, [tabVisible]);

  // tsparticles types are mismatched across its own sub-packages
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
      options={particlesOptions as RecursivePartial<IOptions>}
    />
  );
}

export default BackgroundParticles;
