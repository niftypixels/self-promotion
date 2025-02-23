import '../styles/Footer.scss';

function Footer() {
  return (
    <footer className='container'>
      <div>
        <img src='/sadmac.png' alt='' />
        <p>Made with <strong>❤</strong> in OC</p>
        <span>SCOTT <br /> TWEDE <br /> &copy;{new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}

export default Footer;
