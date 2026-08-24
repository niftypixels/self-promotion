import { useRef } from 'react';
import {
  About,
  BackgroundGrid,
  BackgroundParticles,
  Experience,
  Footer,
  Game,
  Header,
  LavaMask
} from '.';
import { useIsMobile } from '../hooks';
import '../styles/App.scss';

function App() {
  const isMobile = useIsMobile();
  const mainRef = useRef<HTMLElement>(null);

  return (
    <>
      <BackgroundParticles />
      <main ref={mainRef as React.RefObject<HTMLElement>} role='main'>
        <BackgroundGrid />
        <Header />
        {isMobile ? <About /> : <Game mainRef={mainRef} />}
      </main>
      <LavaMask />
      <Experience />
      <Footer />
    </>
  )
}

export default App;
