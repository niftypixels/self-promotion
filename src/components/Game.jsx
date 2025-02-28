import { useEffect, useRef, useState } from 'react';
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
    engineRef.current = Engine.create({
      gravity: { x: 0, y: 0 }
    });

    worldRef.current = engineRef.current.world;

    const mainRect = mainRef.current.getBoundingClientRect();
    const ballRect = ballRef.current.getBoundingClientRect();
    const paddleRect = paddleRef.current.getBoundingClientRect();

    const wallThickness = 10;
    const walls = [
      // top
      Bodies.rectangle(
        mainRect.width / 2, -wallThickness / 2,
        mainRect.width, wallThickness,
        { isStatic: true, label: 'wall' }
      ),

      // left
      Bodies.rectangle(
        -wallThickness / 2, mainRect.height / 2,
        wallThickness, mainRect.height,
        { isStatic: true, label: 'wall' }
      ),

      // right
      Bodies.rectangle(
        mainRect.width + wallThickness / 2, mainRect.height / 2,
        wallThickness, mainRect.height,
        { isStatic: true, label: 'wall' }
      ),

      // bottom
      Bodies.rectangle(
        mainRect.width / 2, mainRect.height + wallThickness / 2,
        mainRect.width, wallThickness,
        { isStatic: true, isSensor: true, label: 'bottom' }
      ),
    ];

    return () => {
      if (engineRef.current) {
        Events.off(engineRef.current);
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
