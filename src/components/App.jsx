import { useRef } from 'react';
import { BackgroundParticles, Header, Game, Work, Footer } from '.';
import '../styles/App.scss';

function App() {
  const mainRef = useRef(null);

  return (
    <>
      <BackgroundParticles />
      <main ref={mainRef} role='main'>
        <Header />
        <Game mainRef={mainRef} />
      </main>
      <Work />
      <Footer />
    </>
  )
}

export default App;
