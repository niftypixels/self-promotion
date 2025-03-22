import { useRef } from 'react';
import { Header, Game, Lava, Work, Footer } from '.';
import '../styles/App.scss';

function App() {
  const mainRef = useRef(null);

  return (
    <>
      <main ref={mainRef} role='main'>
        <Header />
        <Game mainRef={mainRef} />
        <Lava />
      </main>
      <Work />
      <Footer />
    </>
  )
}

export default App;
