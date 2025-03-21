import { useCallback, useEffect, useRef, useState } from 'react';
import { Body, Bodies, Engine, Events, Render, Runner, World } from 'matter-js';
import '../styles/Game.scss';

const ABOUT = 'I am a software engineer with over a decade of expertise crafting creative interactive applications for top global brands including PlayStation, Samsung, ESPN, Disney, Paramount, Lionsgate, HBO, and UFC — just to name a few.';

const BALL_OFFSET = 50;
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
  const renderAnimationId = useRef(null);

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
    const initBallY = canvasRect.height - BALL_OFFSET;
    const initPaddleX = initBallX;
    const initPaddleY = initBallY;

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
    const render = () => {
      const canvas = canvasRef.current;
      const ctx = contextRef.current;

      const { x: ballX, y: ballY } = ballBodyRef.current.position;
      const { x: paddleX, y: paddleY } = paddleBodyRef.current.position;
      const paddleHalf = {
        height: PADDLE_HEIGHT / 2,
        width: PADDLE_WIDTH / 2
      };

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ball
      ctx.fillStyle = '#dedede';
      ctx.beginPath();
      ctx.arc(
        ballX,
        ballY,
        BALL_RADIUS,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // paddle
      ctx.fillStyle = '#666';
      ctx.beginPath();
      ctx.moveTo(paddleX - paddleHalf.width + paddleHalf.height, paddleY - paddleHalf.height);
      ctx.lineTo(paddleX + paddleHalf.width - paddleHalf.height, paddleY - paddleHalf.height);
      ctx.arc(paddleX + paddleHalf.width - paddleHalf.height, paddleY, paddleHalf.height, Math.PI * 1.5, Math.PI * 0.5);
      ctx.lineTo(paddleX - paddleHalf.width + paddleHalf.height, paddleY + paddleHalf.height);
      ctx.arc(paddleX - paddleHalf.width + paddleHalf.height, paddleY, paddleHalf.height, Math.PI * 0.5, Math.PI * 1.5);
      ctx.closePath();
      ctx.fill();

      renderAnimationId.current = requestAnimationFrame(render);
    };

    renderAnimationId.current = requestAnimationFrame(render);

    return () => {
      if (renderAnimationId.current) {
        cancelAnimationFrame(renderAnimationId.current);
      }
    };
  }, [ballBodyRef.current, paddleBodyRef.current]);

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

    const canvasRect = canvasRef.current.getBoundingClientRect();

    const movePlayer = ({ clientX }) => {
      const minPaddleX = PADDLE_WIDTH / 2;
      const maxPaddleX = canvasRect.width - minPaddleX;
      const boundedX = Math.min(Math.max(clientX, minPaddleX), maxPaddleX);

      if (!gameRunning) {
        Body.setPosition(ballBodyRef.current, {
          x: boundedX,
          y: ballBodyRef.current.position.y
        });
      }

      Body.setPosition(paddleBodyRef.current, {
        x: boundedX,
        y: paddleBodyRef.current.position.y
      });
    };

    window.addEventListener('mousemove', movePlayer);
    return () => window.removeEventListener('mousemove', movePlayer);
  }, [gameRunning]);

  /*
  useEffect(() => {
    if (!gameRunning) return;

    // Set initial velocity for the ball
    Body.setVelocity(ballBodyRef.current, {
      x: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
      y: -BALL_SPEED
    });

    let animationID;

    const render = () => {
      const canvas = canvasRef.current;
      const ctx = contextRef.current;

      const { x: ballX, y: ballY } = ballBodyRef.current.position;
      const { x: paddleX, y: paddleY } = paddleBodyRef.current.position;
      const paddleHalf = {
        height: PADDLE_HEIGHT / 2,
        width: PADDLE_WIDTH / 2
      };

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ball
      ctx.fillStyle = '#dedede';
      ctx.beginPath();
      ctx.arc(
        ballX,
        ballY,
        BALL_RADIUS,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // paddle
      ctx.fillStyle = '#666';
      ctx.beginPath();
      ctx.moveTo(paddleX - paddleHalf.width + paddleHalf.height, paddleY - paddleHalf.height);
      ctx.lineTo(paddleX + paddleHalf.width - paddleHalf.height, paddleY - paddleHalf.height);
      ctx.arc(paddleX + paddleHalf.width - paddleHalf.height, paddleY, paddleHalf.height, Math.PI * 1.5, Math.PI * 0.5);
      ctx.lineTo(paddleX - paddleHalf.width + paddleHalf.height, paddleY + paddleHalf.height);
      ctx.arc(paddleX - paddleHalf.width + paddleHalf.height, paddleY, paddleHalf.height, Math.PI * 0.5, Math.PI * 1.5);
      ctx.closePath();
      ctx.fill();

      animationID = requestAnimationFrame(render);
    };

    animationID = requestAnimationFrame(render);

    return () => {
      if (animationID) {
        cancelAnimationFrame(animationID);
      }

      Body.setVelocity(ballBodyRef.current, { x: 0, y: 0 });
    };
  }, [gameRunning]);
  */

  return (
    <section
      className='container'
      data-game-running={gameRunning}
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
  )
}

export default Game;
