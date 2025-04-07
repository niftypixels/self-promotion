import { Bodies, Body, Engine, Events, Render, Runner, World, Constraint } from 'matter-js';
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
  const gameRef = useRef(null);
  const canvasRef = useRef(null);

  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const runnerRef = useRef(null);
  const worldRef = useRef(null);
  const ballBodyRef = useRef(null);
  const paddleBodyRef = useRef(null);
  const brickBodiesRef = useRef([]);

  const [gameState, setGameState] = useState(GAME_STATE.READY);
  const [lives, setLives] = useState(TOTAL_LIVES);
  const [score, setScore] = useState(0);
  const [physicsKey, setPhysicsKey] = useState(0);

  const livesRef = useRef(TOTAL_LIVES);

  useEffect(() => { // ref tracks state value for non-React event handlers
    livesRef.current = lives;
  }, [lives]);

  useEffect(() => { // init physics engine
    if (!gameRef.current) return;

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
        wireframes: true,
      }
    });

    const initBallX = width / 2;
    const initBallY = height - BALL_OFFSET;
    const initPaddleX = initBallX;
    const initPaddleY = initBallY;

    const wallThickness = 10;
    const wallBodies =  [
      Bodies.rectangle( // top
        width / 2,
        -wallThickness / 2,
        width,
        wallThickness,
        { isStatic: true, label: 'wall' }
      ),
      Bodies.rectangle( // left
        -wallThickness / 2,
        height / 2,
        wallThickness,
        height,
        { isStatic: true, label: 'wall' }
      ),
      Bodies.rectangle( // right
        width + wallThickness / 2,
        height / 2,
        wallThickness,
        height,
        { isStatic: true, label: 'wall' }
      ),
      Bodies.rectangle( // bottom
        width / 2,
        height + wallThickness / 2,
        width,
        wallThickness,
        { isStatic: true, isSensor: true, label: 'bottom' }
      )
    ];

    brickBodiesRef.current = Array.from(gameRef.current.getElementsByClassName('brick')).map(domElement => {
      const rect = domElement.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      const brick = Bodies.rectangle(
        x,
        y,
        rect.width,
        rect.height,
        {
          domElement,
          isStatic: false,
          label: 'brick',
          render: { fillStyle: 'transparent' },
          mass: 0.1, // Lower mass for more movement
          restitution: 0.2,
          friction: 0.1,
          frictionAir: 0.1,
          inertia: Infinity
        }
      );

      // Create a constraint to keep the brick in place
      const constraint = Constraint.create({
        pointA: { x, y },
        bodyB: brick,
        stiffness: 0.2, // Lower stiffness for more movement
        damping: 0.2, // Lower damping for more oscillation
        length: 0
      });

      World.add(worldRef.current, constraint);
      return brick;
    });

    ballBodyRef.current = Bodies.circle(
      initBallX,
      initBallY,
      BALL_RADIUS,
      {
        label: 'ball',
        restitution: 1,
        friction: 0,
        frictionAir: 0,
        inertia: Infinity,
        render: { fillStyle: '#dedede' },
        density: 0.0001, // Even lower density
        slop: 0,
        chamfer: { radius: 0 }, // Prevent any collision resolution artifacts
        collisionFilter: {
          group: -1, // Negative group means no collision response
          category: 0x0001,
          mask: 0xFFFF
        }
      }
    );

    paddleBodyRef.current = Bodies.rectangle(
      initPaddleX,
      initPaddleY,
      PADDLE_WIDTH,
      PADDLE_HEIGHT,
      {
        isStatic: true,
        label: 'paddle',
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
          const ballBody = bodyA.label === 'ball' ? bodyA : bodyB;

          if (brickBody.domElement) {
            brickBody.domElement.classList.add('hit');
          }

          World.remove(worldRef.current, brickBody);
          brickBodiesRef.current = brickBodiesRef.current.filter(b => b.id !== brickBody.id);

          // Calculate collision normal and reflect velocity
          const normal = {
            x: ballBody.position.x - brickBody.position.x,
            y: ballBody.position.y - brickBody.position.y
          };
          const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
          normal.x /= length;
          normal.y /= length;

          // Get current velocity
          const velocity = ballBody.velocity;
          const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
          
          // Calculate new speed (10% increase)
          const newSpeed = Math.min(speed * 1.1, BALL_SPEED_MAX);
          
          // Reflect velocity using normal
          const dot = velocity.x * normal.x + velocity.y * normal.y;
          const newVelocity = {
            x: velocity.x - 2 * dot * normal.x,
            y: velocity.y - 2 * dot * normal.y
          };
          
          // Normalize and scale to new speed
          const newLength = Math.sqrt(newVelocity.x * newVelocity.x + newVelocity.y * newVelocity.y);
          Body.setVelocity(ballBody, {
            x: (newVelocity.x / newLength) * newSpeed,
            y: (newVelocity.y / newLength) * newSpeed
          });

          setScore(prevScore => prevScore + 100);

          if (brickBodiesRef.current.length === 0) {
            Body.setVelocity(ballBodyRef.current, { x: 0, y: 0 });
            setGameState(GAME_STATE.WIN);
          }
        }

        if (
          (bodyA.label === 'ball' && bodyB.label === 'wall') ||
          (bodyA.label === 'wall' && bodyB.label === 'ball')
        ) {
          const ballBody = bodyA.label === 'ball' ? bodyA : bodyB;
          const { velocity } = ballBody;
          const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);

          // add slight angular variation (0.05-0.15 radians or about 3-8 degrees)
          const angle = Math.atan2(velocity.y, velocity.x) + (Math.random() - 0.5) * 0.1;

          // apply the new velocity on next tick to not interfere with the collision resolution
          setTimeout(() => {
            Body.setVelocity(ballBody, {
              x: Math.cos(angle) * speed,
              y: Math.sin(angle) * speed
            });
          }, 0);
        }

        if (
          (bodyA.label === 'ball' && bodyB.label === 'bottom') ||
          (bodyA.label === 'bottom' && bodyB.label === 'ball')
        ) {
          if (livesRef.current > 1) {
            // Position ball above paddle with some clearance
            Body.setPosition(ballBodyRef.current, {
              x: paddleBodyRef.current.position.x,
              y: paddleBodyRef.current.position.y - BALL_RADIUS - PADDLE_HEIGHT - 5
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

  useEffect(() => { // click binding
    mainRef.current.addEventListener('click', handleClick);
    return () => mainRef.current.removeEventListener('click', handleClick);
  }, [handleClick]);

  const handleResize = useDebounce(() => {
    setPhysicsKey(key => key + 1);
  }, 250);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

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
        {gameState} {lives}
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
