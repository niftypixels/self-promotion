import { useEffect, useRef } from 'react';
import '../styles/Magic8Ball.scss';

const FACE_TRANSFORMS = {
  face1: [0, 0],
  face2: [0, 180],
  face3: [0, 90],
  face4: [0, -90],
  face5: [-90, 0],
  face6: [90, 0],
};

function Magic8Ball({ focus = null }) {
  const cubeRef = useRef(null);
  const rafRef = useRef(null);
  const idleState = useRef({ ry: 30, dir: 1 });

  useEffect(() => {
    const cube = cubeRef.current;
    if (!cube) return;

    if (focus && FACE_TRANSFORMS[focus]) {
      cancelAnimationFrame(rafRef.current);
      const [rx, ry] = FACE_TRANSFORMS[focus];
      cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      return;
    }

    const state = idleState.current;

    function tick() {
      state.ry += 0.15 * state.dir;
      if (state.ry > 50) state.dir = -1;
      if (state.ry < 10) state.dir = 1;
      cube.style.transform = `rotateX(-20deg) rotateY(${state.ry}deg)`;
      rafRef.current = requestAnimationFrame(tick);
    }
    tick();

    return () => cancelAnimationFrame(rafRef.current);
  }, [focus]);

  return (
    <div id='magic8ball'>
      <div id='cube-scene'>
        <div id='cube-bob'>
          <div id='cube' ref={cubeRef}>
            <div className='face face1'>1</div>
            <div className='face face2'>2</div>
            <div className='face face3'>3</div>
            <div className='face face4'>4</div>
            <div className='face face5'>5</div>
            <div className='face face6'>6</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Magic8Ball;
