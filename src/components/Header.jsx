import '../styles/Header.scss';

function Header() {
  return (
    <header className='container'>
      <div>
        <hgroup>
          <h1>SCOTT <br /> TWEDE</h1>
          <h2>UX <img src='bolt.svg' alt='🗲' /> UI</h2>
        </hgroup>
        <a href='mailto:scott@twede.dev'>
          scott@twede.dev
        </a>
      </div>
    </header>
  )
}

export default Header;
