import { useEffect, useRef, useState } from 'react';
import '../styles/Game.scss';

const ABOUT = 'I am a software engineer with over a decade of expertise crafting creative interactive applications for top global brands including PlayStation, Samsung, ESPN, Disney, Paramount, Lionsgate, HBO, and UFC — just to name a few.';

function Game({ world }) {
  useEffect(() => {
    console.log(world.current.getBoundingClientRect());
  }, []);

  return (
    <section className='container' id='game'>
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
