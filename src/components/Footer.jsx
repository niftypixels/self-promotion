import { BackgroundStatic } from '.';
import '../styles/Footer.scss';

function Footer() {
  return (
    <footer className='container'>
      <BackgroundStatic fps={30} />
      <img className='avatar' src='sadmac.png' alt='' />
      <p>Made with <img src='heart.svg' alt='❤' /> in OC</p>
      <span>SCOTT <br /> TWEDE <br /> &copy;{new Date().getFullYear()}</span>
      <a href='mailto:scott@twede.dev'>
        Email
      </a>
      <a href='//github.com/niftypixels/self-promotion/' target='_blank'>
        GitHub
      </a>
      <a href='//linkedin.com/in/niftypixels/' target='_blank'>
        LinkedIn
      </a>
      <a href='Scott-Twede-Resume.pdf' target='_blank'>
        PDF
      </a>
    </footer>
  )
}

export default Footer;
