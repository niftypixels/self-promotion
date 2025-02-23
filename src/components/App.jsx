import { useRef } from 'react';
import { Header, Game, Work, Footer } from '.';
import '../styles/App.scss';

function App() {
  const mainRef = useRef(null);

  return (
    <>
      <main ref={mainRef}>
        <Header />
        <Game />
      </main>
      <Work />
      <Footer />
    </>
  )
}

export default App;
