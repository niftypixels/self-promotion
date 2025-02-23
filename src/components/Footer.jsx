import '../styles/Footer.scss';

function Footer() {
  return (
    <footer className='container'>
      <img src='/sadmac.png' alt='' />
      <p>Made with <strong>❤</strong> in OC</p>
      <span>SCOTT <br /> TWEDE <br /> &copy;{new Date().getFullYear()}</span>
    </footer>
  )
}

export default Footer;
