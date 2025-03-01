import { useCallback, useEffect, useRef, useState } from 'react';
import { Body, Bodies, Engine, Events, Render, Runner, World } from 'matter-js';
import useInterval from './hooks/useInterval';
import '../styles/Game.scss';

const ABOUT = 'I am a software engineer with over a decade of expertise crafting creative interactive applications for top global brands including PlayStation, Samsung, ESPN, Disney, Paramount, Lionsgate, HBO, and UFC — just to name a few.';

const BALL_SPEED = 7;
const BALL_SPEED_MAX = 18;
const FRAME_TIME = 1000 / 60;
const TOTAL_LIVES = 3;

function Game({ mainRef }) {
  const gameRef = useRef(null);
  const ballRef = useRef(null);
  const paddleRef = useRef(null);
  const engineRef = useRef(null);

  const worldRef = useRef(null);
  const ballBodyRef = useRef(null);
  const paddleBodyRef = useRef(null);
  const brickBodiesRef = useRef([]);

  const [bricks, setBricks] = useState([]);
  const [gameRunning, setGameRunning] = useState(false);
  const [lives, setLives] = useState(TOTAL_LIVES);
  const [score, setScore] = useState(0);

  useEffect(() => { // init physics engine
    if (!gameRef.current) return;

    engineRef.current = Engine.create({
      gravity: { x: 0, y: 0 }
    });

    worldRef.current = engineRef.current.world;

    const mainRect = mainRef.current.getBoundingClientRect();
    const ballRect = ballRef.current.getBoundingClientRect();
    const paddleRect = paddleRef.current.getBoundingClientRect();

    const wallThickness = 10;
    const wallBodies =  [
      Bodies.rectangle( // top
        mainRect.width / 2, -wallThickness / 2,
        mainRect.width, wallThickness,
        { isStatic: true, label: 'wall' }
      ),

      Bodies.rectangle( // left
        -wallThickness / 2, mainRect.height / 2,
        wallThickness, mainRect.height,
        { isStatic: true, label: 'wall' }
      ),

      Bodies.rectangle( // right
        mainRect.width + wallThickness / 2, mainRect.height / 2,
        wallThickness, mainRect.height,
        { isStatic: true, label: 'wall' }
      ),

      Bodies.rectangle( // bottom
        mainRect.width / 2, mainRect.height + wallThickness / 2,
        mainRect.width, wallThickness,
        { isStatic: true, isSensor: true, label: 'bottom' }
      )
    ];

    const ballRadius = ballRect.width / 2;
    ballBodyRef.current = Bodies.circle(
      ballRect.left + ballRadius,
      ballRect.top + ballRadius,
      ballRadius,
      {
        label: 'ball',
        restitution: 1, // perfect bounce
        friction: 0,
        frictionAir: 0,
        inertia: Infinity, // prevents rotation
        render: { fillStyle: 'transparent' }
      }
    );

    paddleBodyRef.current = Bodies.rectangle(
      paddleRect.left + paddleRect.width / 2,
      paddleRect.top + paddleRect.height / 2,
      paddleRect.width,
      paddleRect.height,
      {
        isStatic: true,
        label: 'paddle',
        chamfer: { radius: paddleRect.height / 2 }, // rounded edges
        render: { fillStyle: 'transparent' }
      }
    );

    const brickElements = Array.from(gameRef.current.getElementsByClassName('brick'));

    setBricks(brickElements);

    brickBodiesRef.current = brickElements.map(domElement => {
      const rect = domElement.getBoundingClientRect();
      return Bodies.rectangle(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        rect.width,
        rect.height,
        {
          domElement,
          isStatic: true,
          label: 'brick',
          render: { fillStyle: 'transparent' }
        }
      );
    });

    World.add(worldRef.current, [
      wallBodies,
      ballBodyRef.current,
      paddleBodyRef.current,
      ...brickBodiesRef.currewnt
    ]);

    runnerRef.current = Runner.create();
    Runner.run(runnerRef.current, engineRef.current);

    return () => {
      if (runnerRef.current) {
        Runner.stop(runnerRef.current);
      }

      if (engineRef.current) {
        World.clear(worldRef.current);
        Engine.clear(engineRef.current);
      }
    };
  }, [gameRef.current]);

  return (
    <section className='container' id='game' ref={gameRef}>
      <div id='wall'>
        {ABOUT.split('').map((char, index) => (
          (char === ' ') ? char :
          <span className='brick' key={index}>{char}</span>
        ))}
      </div>
      <div id='player'>
        <div id='ball' ref={ballRef} />
        <div id='paddle' ref={paddleRef} />
      </div>
    </section>
  )
}

export default Game;
