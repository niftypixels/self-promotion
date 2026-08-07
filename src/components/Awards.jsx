import { useEffect, useRef, useState } from 'react';
import '../styles/Awards.scss';

const ENTER_MS = 500;
const VISIBLE_MS = 3000;
const EXIT_MS = 500;
const PAUSE_POLL_MS = 200;

const Phase = Object.freeze({
  ENTER: 'enter',
  SHOWN: 'shown',
  EXIT: 'exit',
});

const AWARDS = [
  {
    award: 'FWA Mobile of the Day',
    date: new Date('6/22/14'),
    href: '//thefwa.com/cases/el-rey-network',
    project: "El Rey Network"
  },
  {
    award: 'FWA of the Day',
    date: new Date('2/5/13'),
    href: '//thefwa.com/cases/ufc-social',
    project: "UFC Social"
  },
  {
    award: 'FWA of the Day',
    date: new Date('2/24/12'),
    href: '//thefwa.com/cases/the-hunt-for-the-golden-pistachio',
    project: "The Hunt for the Golden Pistachio"
  },
  {
    award: 'FWA of the Day',
    date: new Date('12/4/11'),
    href: '//thefwa.com/cases/lucasfilm-s-star-wars-visualizer',
    project: "Lucasfilm's Star Wars Visualizer"
  }
];

function Awards() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState(Phase.ENTER);
  const pausedRef = useRef(false);

  useEffect(() => {
    setPhase(Phase.ENTER);
    const timer = setTimeout(() => setPhase(Phase.SHOWN), ENTER_MS);
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (phase !== Phase.SHOWN) return;

    let timer;
    const tryExit = () => {
      if (pausedRef.current) {
        timer = setTimeout(tryExit, PAUSE_POLL_MS);
      } else {
        setPhase(Phase.EXIT);
      }
    };
    timer = setTimeout(tryExit, VISIBLE_MS);

    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== Phase.EXIT) return;
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % AWARDS.length);
    }, EXIT_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <div id='awards'>
      <div className='emitter'>
        <span className={phase}>&#9733;</span>
      </div>
      <ul role='list'>
        {AWARDS.map(({ award, date, href, project }, i) => (
          <li
            key={href}
            className={i === index ? phase : 'idle'}
            aria-hidden={i !== index}
            onMouseEnter={() => { pausedRef.current = true; }}
            onMouseLeave={() => { pausedRef.current = false; }}
          >
            <a href={href} target='_blank'>
              {project}
              <small>{award}, {date.toDateString().slice(4)}</small>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Awards;
