import { useRef } from 'react';
import { Header, Game, Work, Footer } from '.';
import '../styles/App.scss';

function App() {
  const mainRef = useRef(null);

  return (
    <>
      <main ref={mainRef} role='main'>
        <Header />
        <Game world={mainRef} />
      </main>
      <Work />
      <Footer />
    </>
  )
}

export default App;
