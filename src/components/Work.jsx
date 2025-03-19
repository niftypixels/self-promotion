import { useCallback, useEffect } from 'react';
import Particles from '@tsparticles/react';
import { loadFull } from 'tsparticles';
import '../styles/Work.scss';

function Work() {
  useEffect(() => {
    console.log("Work component mounted");
    return () => console.log("Work component unmounted");
  }, []);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log("Particles container loaded", container);
  }, []);

  const particlesOptions = {
    fpsLimit: 60,
    background: {
      color: "#000"
    },
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: {
          enable: true,
          mode: "repulse",
          parallax: { enable: false, force: 60, smooth: 10 }
        },
        resize: true
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 200, duration: 0.4 }
      }
    },
    particles: {
      color: { value: "#ffffff" },
      move: {
        direction: "none",
        enable: true,
        outModes: "out",
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
          startValue: "max",
          count: 1,
          destroy: "min"
        },
        value: {
          min: 0,
          max: 0.5
        }
      },
      shape: {
        type: "circle"
      },
      size: {
        value: { min: 1, max: 5 }
      }
    }
  };

  return (
    <section className='container' id='work'>
      <Particles
        id='tsparticles'
        init={particlesInit}
        loaded={particlesLoaded}
        options={particlesOptions}
      />
      <div>
        <article>
          <h1>EXPERIENCE</h1>
          <h2>Sony Interactive Entertainment</h2>
          <pre>07/2014 &mdash; 12/2023 &raquo; Aliso Viejo + San Francisco, CA</pre>
          <h2>RED Interactive Agency</h2>
          <pre>09/2010 &mdash; 06/2014 &raquo; Santa Monica, CA</pre>
        </article>
        <aside>
          <h2>AWARDS</h2>
          <h3>FWA of the Day</h3>
          <ul>
            <li>
              <a href='https://thefwa.com/cases/lucasfilm-s-star-wars-visualizer' target='_blank'>
                Lucasfilm's Star Wars Visualizer
              </a>
            </li>
            <li>
              <a href='https://thefwa.com/cases/the-hunt-for-the-golden-pistachio' target='_blank'>
                The Hunt for the Golden Pistachio
              </a>
            </li>
            <li>
              <a href='https://thefwa.com/cases/ufc-social' target='_blank'>
                UFC Social
              </a>
            </li>
            <li>
              <a href='https://thefwa.com/cases/el-rey-network' target='_blank'>
                El Rey Network
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </section>
  )
}

export default Work;
