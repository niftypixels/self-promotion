import '../styles/Lava.scss';

// Negative topOffset pushes blob peaks above the front layer so they're visible.
// Larger tileWidth = narrower blobs = forced perspective (further = smaller).
const LAYERS = [
  {
    depth: 'back',
    tileWidth: 2200,
    topOffset: -30,
    scrollDuration: 24,
    scrollDelay: -8,
    bobDuration: 4,
    bobDelay: -1.33,
    bobAmplitude: '4px',
    bobScale: 1.05,
  },
  {
    depth: 'mid',
    tileWidth: 1700,
    topOffset: -15,
    scrollDuration: 15,
    scrollDelay: -10,
    bobDuration: 3.2,
    bobDelay: -1.07,
    bobAmplitude: '7px',
    bobScale: 1.15,
  },
  {
    depth: 'front',
    tileWidth: 1400,
    topOffset: 0,
    scrollDuration: 8,
    scrollDelay: 0,
    bobDuration: 2.5,
    bobDelay: 0,
    bobAmplitude: '12px',
    bobScale: 1.3,
  },
];

function Lava() {
  return (
    <div className="lava" aria-hidden="true">
      {LAYERS.map(({ depth, tileWidth, topOffset, scrollDuration, scrollDelay, bobDuration, bobDelay, bobAmplitude, bobScale }) => (
        <div
          key={depth}
          className={`lava__layer lava__layer--${depth}`}
          style={{
            '--tile-width': `${tileWidth}px`,
            '--top-offset': `${topOffset}px`,
            '--scroll-duration': `${scrollDuration}s`,
            '--scroll-delay': `${scrollDelay}s`,
            '--bob-duration': `${bobDuration}s`,
            '--bob-delay': `${bobDelay}s`,
            '--bob-amplitude': bobAmplitude,
            '--bob-scale': bobScale,
          }}
        />
      ))}
    </div>
  );
}

export default Lava;
