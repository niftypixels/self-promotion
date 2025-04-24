import FontFaceObserver from 'fontfaceobserver';
import { Bodies, Body, Engine, Events, Render, Runner, World } from 'matter-js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from '../hooks';
import '../styles/Game.scss';

const ABOUT = 'I am a software engineer with over a decade of expertise crafting creative interactive experiences for top global brands including PlayStation, Samsung, Nvidia, ESPN, Disney, Paramount, Lionsgate, HBO, and UFC — just to name a few.';

const BALL_OFFSET = 30;
const BALL_RADIUS = 9;
const BALL_SPEED = 6;
const BALL_SPEED_MAX = 18;
const PADDLE_HEIGHT = 12;
const PADDLE_WIDTH = 120;
const TOTAL_LIVES = 3;

const GAME_STATE = {
  READY: 'ready',
  RUNNING: 'running',
  OVER: 'over',
  WIN: 'win'
};

function Game({ mainRef }) {
  const [gameState, setGameState] = useState(GAME_STATE.READY);
  const [lives, setLives] = useState(TOTAL_LIVES);
  const [score, setScore] = useState(0);
  const [physicsKey, setPhysicsKey] = useState(0);

  const gameRef = useRef(null);
  const canvasRef = useRef(null);
  const livesRef = useRef(lives);

  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const runnerRef = useRef(null);
  const worldRef = useRef(null);
  const ballBodyRef = useRef(null);
  const paddleBodyRef = useRef(null);
  const brickBodiesRef = useRef([]);

  useEffect(() => { // ref tracks state value for non-React event handlers
    livesRef.current = lives;
  }, [lives]);

  useEffect(() => { // init physics engine
    if (!gameRef.current) return;

    const teardownPhysics = () => {
      if (runnerRef.current) {
        Runner.stop(runnerRef.current);
      }

      if (renderRef.current) {
        Render.stop(renderRef.current);
      }

      if (engineRef.current) {
        World.clear(worldRef.current);
        Engine.clear(engineRef.current);
      }
    };

    teardownPhysics();

    engineRef.current = Engine.create({
      gravity: { x: 0, y: 0 }
    });

    worldRef.current = engineRef.current.world;

    const { height, width } = mainRef.current.getBoundingClientRect();
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;

    renderRef.current = Render.create({
      canvas,
      engine: engineRef.current,
      options: {
        width,
        height,
        background: 'transparent',
        wireframeBackground: 'transparent',
        wireframes: false
      }
    });

    const initBallX = width / 2;
    const initBallY = height - BALL_OFFSET;
    const initPaddleX = initBallX;
    const initPaddleY = initBallY;
    const wallThickness = PADDLE_HEIGHT;

    const wallBodies =  [
      Bodies.rectangle( // top
        width / 2,
        -wallThickness / 2,
        width,
        wallThickness,
        {
          label: 'wall',
          isStatic: true
        }
      ),
      Bodies.rectangle( // left
        -wallThickness / 2,
        height / 2,
        wallThickness,
        height,
        {
          label: 'wall',
          isStatic: true
        }
      ),
      Bodies.rectangle( // right
        width + wallThickness / 2,
        height / 2,
        wallThickness,
        height,
        {
          label: 'wall',
          isStatic: true
        }
      ),
      Bodies.rectangle( // bottom
        width / 2,
        height + wallThickness / 2,
        width,
        wallThickness,
        {
          label: 'bottom',
          isStatic: true,
          isSensor: true
        }
      )
    ];

    brickBodiesRef.current = Array.from(gameRef.current.getElementsByClassName('brick'))
                                  .filter(brick => !brick.classList.contains('hit'))
                                  .map(domElement => {
      const rect = domElement.getBoundingClientRect();
      return Bodies.rectangle(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        rect.width,
        rect.height,
        {
          label: 'brick',
          isStatic: true,
          render: { fillStyle: 'transparent' },
          domElement
        }
      );
    });

    ballBodyRef.current = Bodies.circle(
      initBallX,
      initBallY,
      BALL_RADIUS,
      {
        label: 'ball',
        restitution: 1, // perfect bounce
        friction: 0,
        frictionAir: 0,
        inertia: Infinity, // prevents rotation
        render: { fillStyle: '#dedede' }
      }
    );

    paddleBodyRef.current = Bodies.rectangle(
      initPaddleX,
      initPaddleY,
      PADDLE_WIDTH,
      PADDLE_HEIGHT,
      {
        label: 'paddle',
        isStatic: true,
        render: { fillStyle: '#666' }
      }
    );

    World.add(worldRef.current, [
      ...wallBodies,
      ...brickBodiesRef.current,
      ballBodyRef.current,
      paddleBodyRef.current
    ]);

    Events.on(engineRef.current, 'collisionStart', ({ pairs }) => {
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        const { bodyA, bodyB } = pair;

        if (bodyA.label === 'brick' || bodyB.label === 'brick') {
          const brickBody = bodyA.label === 'brick' ? bodyA : bodyB;

          if (brickBody.domElement) {
            brickBody.domElement.classList.add('hit');
          }

          World.remove(worldRef.current, brickBody);

          brickBodiesRef.current = brickBodiesRef.current.filter(b => b.id !== brickBody.id);

          setScore(prevScore => prevScore + 100);

          if (brickBodiesRef.current.length === 0) {
            Body.setVelocity(ballBodyRef.current, { x: 0, y: 0 });
            setGameState(GAME_STATE.WIN);
          }
        }

        if (
          (bodyA.label === 'ball' && bodyB.label === 'bottom') ||
          (bodyA.label === 'bottom' && bodyB.label === 'ball')
        ) {
          if (livesRef.current > 1) {
            Body.setPosition(ballBodyRef.current, {
              x: paddleBodyRef.current.position.x,
              y: initBallY
            });

            setLives(prevLives => prevLives - 1);
            setGameState(GAME_STATE.READY);
          } else {
            setLives(0);
            setGameState(GAME_STATE.OVER);
          }

          Body.setVelocity(ballBodyRef.current, { x: 0, y: 0 });
        }
      }
    });

    runnerRef.current = Runner.create();
    Runner.run(runnerRef.current, engineRef.current);
    Render.run(renderRef.current);

    return () => {
      teardownPhysics();
    };
  }, [physicsKey]);

  useEffect(() => { // player movement
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const minPaddleX = PADDLE_WIDTH / 2;
    const maxPaddleX = canvasRect.width - minPaddleX;
    const movePlayer = ({ clientX }) => {
      const boundedX = Math.min(Math.max(clientX, minPaddleX), maxPaddleX);

      Body.setPosition(paddleBodyRef.current, {
        x: boundedX,
        y: paddleBodyRef.current.position.y
      });

      if (gameState === GAME_STATE.READY) {
        Body.setPosition(ballBodyRef.current, {
          x: boundedX,
          y: ballBodyRef.current.position.y
        });
      }
    };

    window.addEventListener('mousemove', movePlayer);
    return () => window.removeEventListener('mousemove', movePlayer);
  }, [gameState]);

  const handleClick = useCallback(() => {
    window.scrollTo(0, 0);

    switch (gameState) {
      case GAME_STATE.READY:
        setGameState(GAME_STATE.RUNNING);

        Body.setVelocity(ballBodyRef.current, {
          x: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
          y: -BALL_SPEED
        });
        break;
      case GAME_STATE.OVER:
        setLives(0);
        break;
      case GAME_STATE.WIN:
        setLives(TOTAL_LIVES);
        setScore(0);
        break;
    }
  }, [gameState]);

  useEffect(() => {
    mainRef.current.addEventListener('click', handleClick);
    return () => mainRef.current.removeEventListener('click', handleClick);
  }, [handleClick]);

  const handleResize = useDebounce(() => setPhysicsKey(key => key + 1), 250);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => { // recalculate physics bodies after font loads
    const spaceMono = new FontFaceObserver('Space Mono');
    spaceMono.load().then(() => setPhysicsKey(key => key + 1));
  }, []);

  return (
    <>
    <section
      className='container'
      data-state={gameState}
      id='game'
      ref={gameRef}
    >
      <canvas ref={canvasRef} />
      <div id='wall'>
        {ABOUT.split('').map((char, index) => (
          (char === ' ') ? char :
          <span className='brick' key={index}>{char}</span>
        ))}
      </div>
    </section>
    <aside className='container' id='hud'>
      <div>
        <span id='score'>SCORE: {score}</span>
        <span id='lives'>
          {Array.from({ length: TOTAL_LIVES }).map((_, index) => (
            <div key={index} className={index >= lives ? 'dead' : 'alive'} />
          ))}
        </span>
      </div>
    </aside>
    </>
  )
}

export default Game;
