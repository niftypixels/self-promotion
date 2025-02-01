import { useEffect, useRef, useState } from 'react';
import useInterval from './hooks/useInterval';
import './Game.scss';

const ABOUT = "I am a software engineer with over a decade of expertise crafting creative interactive applications for top global brands including PlayStation, Samsung, ESPN, Disney, Paramount, Lionsgate, HBO, and UFC — just to name a few.";

const BALL_SPEED = 7;
const BALL_SPEED_MAX = 18;
const BALL_VELOCITY = {
  x: BALL_SPEED * Math.sign(Math.random() - 0.5),
  y: -BALL_SPEED
};
const FRAME_TIME = 1000 / 60;
const TOTAL_LIVES = 3;

function Game({ mainRef }) {
  const gameRef = useRef(null);
  const ballRef = useRef(null);
  const paddleRef = useRef(null);

  const [bricks, setBricks] = useState([]);
  const [ballVelocity, setBallVelocity] = useState(BALL_VELOCITY);
  const [ballOffset, setBallOffset] = useState(null);
  const [ballX, setBallX] = useState(null);
  const [ballY, setBallY] = useState(null);
  const [paddleOffset, setPaddleOffset] = useState(null);
  const [paddleX, setPaddleX] = useState(null);
  const [paddleY, setPaddleY] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [lives, setLives] = useState(TOTAL_LIVES);
  const [score, setScore] = useState(0);
  const [world, setWorld] = useState(null);

  const checkBrickCollision = () => {
    for (let i = 0; i < bricks.length; i++) {
      const brick = bricks[i];

      if (!brick.hit) {
        const { rect } = brick;

        if (
          ballX + ballOffset >= rect.left &&
          ballX - ballOffset <= rect.right &&
          ballY + ballOffset >= rect.top &&
          ballY - ballOffset <= rect.bottom
        ) {
          brick.element.classList.add('hit');

          setBricks((prevBricks) => {
            const newBricks = [...prevBricks];
            newBricks[i] = { ...brick, hit: true };

            return newBricks;
          });

          setScore(() => score + 100);

          return true;
        }
      }
    }

    return false;
  }

  const increaseBallSpeed = ({ x, y }) => {
    const angle = Math.atan2(y, x) + Math.sign(Math.random() - 0.5) * 0.1;
    const currentSpeed = Math.sqrt(x ** 2 + y ** 2);
    const increment = (BALL_SPEED_MAX - currentSpeed) * 0.1;
    const newSpeed = Math.min(BALL_SPEED_MAX, currentSpeed + increment);

    return {
      x: newSpeed * Math.cos(angle),
      y: newSpeed * Math.sin(angle)
    };
  };

  useEffect(() => { // init
    const mainRect = mainRef.current.getBoundingClientRect();
    const ballRect = ballRef.current.getBoundingClientRect();
    const paddleRect = paddleRef.current.getBoundingClientRect();

    const brickElements = gameRef.current.querySelectorAll('.brick');
    const brickInfo = Array.from(brickElements).map((element) => ({
      element,
      hit: false,
      rect: element.getBoundingClientRect().toJSON()
    }));

    const minPaddleX = paddleRect.width / 2;
    const maxPaddleX = mainRect.width - minPaddleX;
    const movePaddle = ({ clientX }) => (
      setPaddleX(() => Math.min(Math.max(clientX, minPaddleX), maxPaddleX))
    );

    setBricks(() => brickInfo);
    setBallOffset(() => ballRect.width / 2);
    setBallX(() => ballRect.left + ballRect.width / 2);
    setBallY(() => ballRect.top - ballRect.height / 2);
    setPaddleOffset(() => minPaddleX);
    setPaddleX(() => paddleRect.left + minPaddleX);
    setPaddleY(() => paddleRect.top);
    setWorld(() => mainRect.toJSON());

    window.addEventListener('mousemove', movePaddle);
    return () => window.removeEventListener('mousemove', movePaddle);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      setGameRunning(() => !gameRunning);
      gameRef.current.classList.toggle('game-running');
    };

    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [gameRunning]);

  useInterval(() => { // game loop

    setBallX((prevX) => {
      const nextX = prevX + ballVelocity.x;

      if (
        nextX - ballOffset < world.left ||
        nextX + ballOffset > world.right
      ) {
        setBallVelocity((prevVel) => ({
          ...prevVel,
          x: -prevVel.x
        }));

        return prevX;
      }

      if (checkBrickCollision()) {
        setBallVelocity((prevVel) => increaseBallSpeed({
          ...prevVel,
          x: -prevVel.x
        }));

        return prevX;
      }

      return nextX;
    });

    setBallY((prevY) => {
      const nextY = prevY + ballVelocity.y;

      if (nextY - ballOffset < world.top || (
          nextY + ballOffset >= paddleY &&
          ballX >= paddleX - paddleOffset &&
          ballX <= paddleX + paddleOffset
      )) {
        setBallVelocity((prevVel) => ({
          ...prevVel,
          y: -prevVel.y
        }));

        return prevY;
      }

      if (checkBrickCollision()) {
        setBallVelocity((prevVel) => increaseBallSpeed({
          ...prevVel,
          y: -prevVel.y
        }));

        return prevY;
      }

      if (nextY >= world.bottom) {
        if (lives > 0) {
          setLives(() => lives - 1);
          setBallVelocity(BALL_VELOCITY);
        } else {
          console.log('game over', score);

          setGameRunning(() => false);
          gameRef.current.classList.remove('game-running');
        }

        return prevY;
      }

      return nextY;
    });

  }, gameRunning ? FRAME_TIME : null);

  return (
    <section id='game' ref={gameRef}>
      <div id='wall'>
        {ABOUT.split('').map((char, index) => (
          (char === ' ') ? char :
          <span className='brick' key={index}>{char}</span>
        ))}
      </div>
      <div
        className='life'
        id='ball'
        ref={ballRef}
        style={{ left: ballX, top: ballY }}
      />
      <div
        id='paddle'
        ref={paddleRef}
        style={{ left: paddleX }}
      />
      <aside id='floor'>
        <div>
          <span id='score'>Score: {score}</span>
          <span id='lives'>
            {Array.from({ length: TOTAL_LIVES }).map((_, index) => (
              <div className={`life ${index >= lives ? 'lost' : ''}`} key={index} />
            ))}
          </span>
        </div>
      </aside>
    </section>
  )
}

export default Game;
