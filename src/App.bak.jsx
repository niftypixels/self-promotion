import { useRef } from 'react';
import Game from './Game';
import Work from './Work';
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
      <Work />
      <footer>
        <img src="/sadmac.png" alt="" />
        <p>Made with <strong>❤</strong> in OC</p>
        <span>SCOTT <br /> TWEDE <br /> &copy;{new Date().getFullYear()}</span>
      </footer>
    </>
  )
}

export default App;
