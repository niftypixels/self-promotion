import { useRef } from 'react';
import { Header, Game, Lava, Work, Footer, ParticleBackground } from '.';
import '../styles/App.scss';

function App() {
  const mainRef = useRef(null);

  return (
    <>
      <ParticleBackground />
      <main ref={mainRef} role='main'>
        <Header />
        <Game mainRef={mainRef} />
        {/* <Lava /> */}
      </main>
      <Work />
      <Footer />
    </>
  )
}

export default App;
