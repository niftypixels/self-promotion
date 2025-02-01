import { useEffect, useRef, useState } from 'react';
import Game from './Game';
import About from './About';
import './App.scss';

function App() {
  const mainRef = useRef(null);

  return (
    <>
      <main ref={mainRef}>
        <header>
          <hgroup>
            <h1>SCOTT <br /> TWEDE</h1>
            <h2>UX 🗲 UI</h2>
          </hgroup>
          <a href='mailto:scott@niftypixels.com'>
            scott@niftypixels.com
          </a>
        </header>
        <Game mainRef={mainRef} />
      </main>
      <About />
      <footer>
        <img src="/sadmac.png" alt="" />
        <p>
          Made with <strong>&#x1F394;</strong> in OC
          <span>&copy;{new Date().getFullYear()}, Scott Twede</span>
        </p>
      </footer>
    </>
  )
}

export default App;
