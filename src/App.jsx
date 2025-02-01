import { useEffect, useRef, useState } from 'react';
import Game from './Game';
import './App.scss';

function App() {
  const mainRef = useRef(null);

  return (
    <>
      <main ref={mainRef}>
        <header className='container'>
          <h1>SCOTT <br /> TWEDE</h1>
          <h2>UX 🗲 UI</h2>
          {/* <img src="/sadmac.png" alt="" /> */}
        </header>
        <Game mainRef={mainRef} />
      </main>
      <section id='about' className='container'>
        <div>
          <h1>Experience</h1>
          <h3>Sony Interactive Entertainment</h3>
          <h3>RED Interactive Agency</h3>
        </div>
        <div>
          <h1>Awards</h1>
          <h3>FWA of the Day</h3>
          <ul>
            <li>
              <a href='https://thefwa.com/cases/lucasfilm-s-star-wars-visualizer'>Lucasfilm's Star Wars Visualizer</a>
            </li>
            <li>
              <a href='https://thefwa.com/cases/the-hunt-for-the-golden-pistachio'>The Hunt for the Golden Pistachio</a>
            </li>
            <li>
              <a href='https://thefwa.com/cases/ufc-social'>UFC Social</a>
            </li>
            <li>
              <a href='https://thefwa.com/cases/el-rey-network'>El Rey Network</a>
            </li>
          </ul>
        </div>
      </section>
      <footer className='container'>
        <span>&copy;{new Date().getFullYear()}</span>
        <a href='mailto:scott@niftypixels.com'>scott@niftypixels.com</a>
      </footer>
    </>
  )
}

export default App;
