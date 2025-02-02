import { useRef } from 'react';
import About from './About';
import Game from './Game';
import './App.scss';

function App() {
  const mainRef = useRef(null);

  return (
    <>
      <main ref={mainRef}>
        <header>
          <hgroup>
            <h1>SCOTT <br /> TWEDE</h1>
            <h2>UX &#x1F5F2; UI</h2>
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
        <p>Made with <strong>&#x1F394;</strong> in OC</p>
        <span>SCOTT <br /> TWEDE <br /> &copy;{new Date().getFullYear()}</span>
      </footer>
    </>
  )
}

export default App;
