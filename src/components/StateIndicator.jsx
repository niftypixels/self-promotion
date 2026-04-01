import { useState } from 'react';
import '../styles/StateIndicator.scss';

const FACES = [
  { label: 'ready',   text: 'Click to Play' },
  { label: 'running', text: null },
  { label: 'over',    text: 'Game Over' },
  { label: 'win',     text: 'WINNER!' },
];

const DEPTH = 50;

function StateIndicator() {
  const [faceIndex, setFaceIndex] = useState(0);

  const handleClick = () => setFaceIndex(i => (i + 1) % FACES.length);

  return (
    <div id='state-indicator' onClick={handleClick}>
      <div
        className='cube'
        style={{ transform: `rotateX(${faceIndex * 90}deg)` }}
      >
        {FACES.map(({ label, text }, i) => (
          <div
            key={label}
            className={`face ${label}`}
            style={{ transform: `rotateX(${-i * 90}deg) translateZ(${DEPTH}px)` }}
          >
            {text && <span>{text}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StateIndicator;
