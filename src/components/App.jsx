import { useRef } from 'react';
import { BackgroundGrid, BackgroundParticles, Header, Game, Work, Footer } from '.';
import '../styles/App.scss';

function App() {
  const mainRef = useRef(null);

  return (
    <>
      <BackgroundParticles />
      <main ref={mainRef} role='main'>
        <BackgroundGrid />
        <Header />
        <Game mainRef={mainRef} />
      </main>
      <Work />
      <Footer />
    </>
  )
}

export default App;
