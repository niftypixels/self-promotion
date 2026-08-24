import { useEffect, useRef } from 'react';
import '../styles/Magic8Ball.scss';

const FACE_TRANSFORMS: Record<string, [number, number]> = {
  face1: [0, 0],
  face2: [0, 180],
  face3: [0, 90],
  face4: [0, -90],
  face5: [-90, 0],
  face6: [90, 0],
};

type FaceName = keyof typeof FACE_TRANSFORMS;

interface Magic8BallProps {
  focus?: FaceName | null;
}

function Magic8Ball({ focus = null }: Magic8BallProps) {
  const cubeRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const cube = cubeRef.current;
    if (!cube) return;

    if (focus && FACE_TRANSFORMS[focus]) {
      cancelAnimationFrame(rafRef.current);
      const [rx, ry] = FACE_TRANSFORMS[focus];
      cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      return;
    }

    return () => cancelAnimationFrame(rafRef.current);
  }, [focus]);

  return (
    <div id='magic8ball'>
      <div id='cube-scene'>
        <div className='bobber' style={{ '--bob-amplitude': '-5px', '--bob-duration': '3s' } as React.CSSProperties}>
          <div id='cube' ref={cubeRef}>
            <div className='face face1'>
              <img src='sadmac.png' alt='Sad Mac' />
            </div>
            <div className='face face2'>2</div>
            <div className='face face3'>
              <img src='github.svg' alt='GitHub' />
            </div>
            <div className='face face4'>
              <img src='linkedin.svg' alt='LinkedIn' />
            </div>
            <div className='face face5'>
              <img src='email.svg' alt='Email' />
            </div>
            <div className='face face6'>
              <img src='pdf.svg' alt='PDF' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Magic8Ball;
