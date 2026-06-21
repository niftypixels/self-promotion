import { useRef } from 'react';
import {
  About,
  BackgroundGrid,
  BackgroundParticles,
  Experience,
  Footer,
  Game,
  Header,
  Lava
} from '.';
import { useIsMobile } from '../hooks';
import '../styles/App.scss';

function App() {
  const isMobile = useIsMobile();
  const mainRef = useRef(null);

  return (
    <>
      <BackgroundParticles />
      <main ref={mainRef} role='main'>
        <BackgroundGrid />
        <Header />
        {isMobile ? <About /> : <Game mainRef={mainRef} />}
      </main>
      <Lava />
      <Experience />
      <Footer />
    </>
  )
}

export default App;
