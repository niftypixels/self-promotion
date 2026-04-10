import { useRef } from 'react';
import { About, BackgroundGrid, BackgroundParticles, Header, Game, Waves, Work, Footer } from '.';
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
        <Waves />
      </main>
      <Work />
      <Footer />
    </>
  )
}

export default App;
