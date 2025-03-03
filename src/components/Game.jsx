import { useCallback, useEffect, useRef, useState } from 'react';
import { Body, Bodies, Engine, Events, Render, Runner, World } from 'matter-js';
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
  const rectRef = useRef({
    main: null,
    ball: null,
    paddle: null,
  });

  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const worldRef = useRef(null);
  const ballBodyRef = useRef(null);
  const paddleBodyRef = useRef(null);
  const brickBodiesRef = useRef([]);

  const [bricks, setBricks] = useState([]);
  const [gameRunning, setGameRunning] = useState(false);
  const [lives, setLives] = useState(TOTAL_LIVES);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => { // dom init
    if (!mainRef.current) return;

    rectRef.current = {
      main: mainRef.current.getBoundingClientRect(),
      ball: ballRef.current.getBoundingClientRect(),
      paddle: paddleRef.current.getBoundingClientRect(),
    };

    setBricks(Array.from(gameRef.current.getElementsByClassName('brick')));
  }, [mainRef.current]);

  useEffect(() => { // init physics engine
    if (!gameRef.current) return;

    engineRef.current = Engine.create({
      gravity: { x: 0, y: 0 }
    });

    worldRef.current = engineRef.current.world;

    const { main, ball, paddle } = rectRef.current;

    const wallThickness = 10;
    const wallBodies =  [
      Bodies.rectangle( // top
        main.width / 2,
        -wallThickness / 2,
        main.width,
        wallThickness,
        { isStatic: true, label: 'wall' }
      ),
      Bodies.rectangle( // left
        -wallThickness / 2,
        main.height / 2,
        wallThickness,
        main.height,
        { isStatic: true, label: 'wall' }
      ),
      Bodies.rectangle( // right
        main.width + wallThickness / 2,
        main.height / 2,
        wallThickness,
        main.height,
        { isStatic: true, label: 'wall' }
      ),
      Bodies.rectangle( // bottom
        main.width / 2,
        main.height + wallThickness / 2,
        main.width,
        wallThickness,
        { isStatic: true, isSensor: true, label: 'bottom' }
      )
    ];

    brickBodiesRef.current = bricks.map(domElement => {
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

    const ballRadius = ball.width / 2;
    ballBodyRef.current = Bodies.circle(
      ball.left + ballRadius,
      ball.top + ballRadius,
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
      paddle.left + paddle.width / 2,
      paddle.top + paddle.height / 2,
      paddle.width,
      paddle.height,
      {
        isStatic: true,
        label: 'paddle',
        chamfer: { radius: paddle.height / 2 }, // rounded edges
        render: { fillStyle: 'transparent' }
      }
    );

    World.add(worldRef.current, [
      ...wallBodies,
      ...brickBodiesRef.current,
      ballBodyRef.current,
      paddleBodyRef.current
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

  useEffect(() => {
    const onClick = (e) => {
      window.scrollTo(0, 0);
      setGameRunning(() => !gameRunning);
    };

    mainRef.current.addEventListener('click', onClick);
    return () => mainRef.current.removeEventListener('click', onClick);
  }, [gameRunning]);

  useEffect(() => {
    // if (!gameRunning) return;

    const movePaddle = ({ clientX }) => {
      const { main, paddle } = rectRef.current;

      const minPaddleX = paddle.width / 2;
      const maxPaddleX = main.width - minPaddleX;

      const boundedX = Math.min(Math.max(clientX, minPaddleX), maxPaddleX);
      const offsetX = boundedX - (main.width / 2);

      paddleRef.current.style.transform = `translateX(${offsetX}px)`;

      Body.setPosition(paddleBodyRef.current, {
        x: boundedX,
        y: paddleBodyRef.current.position.y
      });
    };

    window.addEventListener('mousemove', movePaddle);
    return () => window.removeEventListener('mousemove', movePaddle);
  }, [gameRunning]);

  /*
  useEffect(() => {
    if (!gameRunning) return;

    Body.setVelocity(ballBodyRef.current, {
      x: 0,
      y: -BALL_SPEED
    });

    let last = 0;
    const frame = (time) => {
      const delta = time - last;

      if (delta > FRAME_TIME) {
        const { x: ballX, y: ballY } = ballBodyRef.current.position;
        const ballR = rectRef.current.ball.width / 2;

        ballRef.current.style.transform = `translate(${ballX - ballR}px, ${ballY - ballR}px)`;

        last = time;
      }

      requestAnimationFrame(frame);
    };

    const animationID = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animationID);
  }, [gameRunning]);
  */

  return (
    <section
      className='container'
      data-game-running={gameRunning}
      id='game'
      ref={gameRef}
    >
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
