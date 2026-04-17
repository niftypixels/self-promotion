import { useRef } from 'react';
import { About, BackgroundGrid, BackgroundParticles, Header, Game, Waves, LavaMask, Experience, Footer } from '.';
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
        {/* <Waves /> */}
      </main>
      <LavaMask />
      <Experience />
      <LavaMask bottom />
      <Footer />
    </>
  )
}

export default App;
