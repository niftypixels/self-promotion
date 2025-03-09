import { useCallback, useEffect, useRef, useState } from 'react';
import { Body, Bodies, Engine, Events, Render, Runner, World } from 'matter-js';
import '../styles/Game.scss';

const ABOUT = 'I am a software engineer with over a decade of expertise crafting creative interactive applications for top global brands including PlayStation, Samsung, ESPN, Disney, Paramount, Lionsgate, HBO, and UFC — just to name a few.';

const BALL_RADIUS = 9;
const BALL_SPEED = 6;
const BALL_SPEED_MAX = 18;
const PADDLE_HEIGHT = 12;
const PADDLE_WIDTH = 120;
const TOTAL_LIVES = 3;

function Game({ mainRef }) {
  const gameRef = useRef(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const worldRef = useRef(null);
  const ballBodyRef = useRef(null);
  const paddleBodyRef = useRef(null);
  const brickBodiesRef = useRef([]);

  const [gameRunning, setGameRunning] = useState(false);
  const [lives, setLives] = useState(TOTAL_LIVES);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    if (!mainRef.current) return;

    const { height, width } = mainRef.current.getBoundingClientRect();
    const canvas = canvasRef.current;

    canvas.height = height;
    canvas.width = width;

    contextRef.current = canvas.getContext('2d');
  }, []);

  useEffect(() => { // init physics engine
    if (!gameRef.current) return;

    engineRef.current = Engine.create({
      gravity: { x: 0, y: 0 }
    });

    worldRef.current = engineRef.current.world;

    const canvasRect = canvasRef.current.getBoundingClientRect();

    const initBallX = canvasRect.width / 2;
    const initBallY = canvasRect.height - 100;
    const initPaddleX = initBallX;
    const initPaddleY = initBallY + 50;

    const wallThickness = 10;
    const wallBodies =  [
      Bodies.rectangle( // top
        canvasRect.width / 2,
        -wallThickness / 2,
        canvasRect.width,
        wallThickness,
        { isStatic: true, label: 'wall' }
      ),
      Bodies.rectangle( // left
        -wallThickness / 2,
        canvasRect.height / 2,
        wallThickness,
        canvasRect.height,
        { isStatic: true, label: 'wall' }
      ),
      Bodies.rectangle( // right
        canvasRect.width + wallThickness / 2,
        canvasRect.height / 2,
        wallThickness,
        canvasRect.height,
        { isStatic: true, label: 'wall' }
      ),
      Bodies.rectangle( // bottom
        canvasRect.width / 2,
        canvasRect.height + wallThickness / 2,
        canvasRect.width,
        wallThickness,
        { isStatic: true, isSensor: true, label: 'bottom' }
      )
    ];

    brickBodiesRef.current = Array.from(gameRef.current.getElementsByClassName('brick')).map(domElement => {
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
        chamfer: { radius: PADDLE_HEIGHT / 2 }, // rounded edges
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
        }
      }
    });

    runnerRef.current = Runner.create();
    Runner.run(runnerRef.current, engineRef.current);

    // TODO: delete the wireframe renderer
    const render = Render.create({
      element: gameRef.current,
      engine: engineRef.current,
      options: {
        width: canvasRect.width,
        height: canvasRect.height,
        wireframes: true,
        showAngleIndicator: true,
        showCollisions: true,
        showVelocity: true,
        background: 'transparent',
        wireframeBackground: 'transparent',
        hasBounds: false,
        pixelRatio: 'auto',
        showSleeping: true
      }
    });
    Render.run(render);

    return () => {
      if (runnerRef.current) {
        Runner.stop(runnerRef.current);
      }

      // TODO: delete when finished with wireframe renderer
      if (render) {
        Render.stop(render);
        render.canvas.remove();
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
      setGameRunning((running) => !running);
    };

    mainRef.current.addEventListener('click', onClick);
    return () => mainRef.current.removeEventListener('click', onClick);
  }, [gameRunning]);

  useEffect(() => {
    // if (!gameRunning) return;

    const movePaddle = ({ clientX }) => {
      const canvasRect = canvasRef.current.getBoundingClientRect();

      const minPaddleX = PADDLE_WIDTH / 2;
      const maxPaddleX = canvasRect.width - minPaddleX;

      const boundedX = Math.min(Math.max(clientX, minPaddleX), maxPaddleX);

      Body.setPosition(paddleBodyRef.current, {
        x: boundedX,
        y: paddleBodyRef.current.position.y
      });
    };

    window.addEventListener('mousemove', movePaddle);
    return () => window.removeEventListener('mousemove', movePaddle);
  }, []);

  useEffect(() => {
    if (!gameRunning) return;

    // Set initial velocity for the ball
    Body.setVelocity(ballBodyRef.current, {
      x: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
      y: -BALL_SPEED
    });

    // Use requestAnimationFrame directly with performance.now() for smoother animation
    let animationID;

    const animate = () => {
      // Get current position from physics engine
      const currentX = ballBodyRef.current.position.x;
      const currentY = ballBodyRef.current.position.y;

      // Calculate the relative motion since initialization
      const deltaX = currentX - initialBallBody.x;
      const deltaY = currentY - initialBallBody.y;

      // Update DOM position directly with the physics delta
      // This preserves the initial flexbox positioning
      ballRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

      // Continue animation
      animationID = requestAnimationFrame(animate);
    };

    // Start animation
    animationID = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationID) {
        cancelAnimationFrame(animationID);
      }
    };
  }, [gameRunning]);

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
      <canvas ref={canvasRef} />
    </section>
  )
}

export default Game;
