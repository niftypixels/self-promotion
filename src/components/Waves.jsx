import { useMemo } from 'react';
import '../styles/Waves.scss';

const WAVE_WIDTH = 10;

function Waves() {
  const count = useMemo(() => Math.ceil(window.innerWidth / WAVE_WIDTH) + 5, []);

  return (
    <div id="waves">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="wave"
          style={{
            left: i * WAVE_WIDTH,
            animationDelay: `${i / 100}s`
          }}
        />
      ))}
    </div>
  );
}

export default Waves;
