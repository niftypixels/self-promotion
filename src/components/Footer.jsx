import { useRef } from 'react';
import { BackgroundStatic } from '.';
import '../styles/Footer.scss';

function Footer() {
  const footerRef = useRef(null);

  return (
    <footer className='container' ref={footerRef}>
      <BackgroundStatic fps={24} parentRef={footerRef} />
      <img src='/sadmac.png' alt='' />
      <p>Made with <strong>❤</strong> in OC</p>
      <span>SCOTT <br /> TWEDE <br /> &copy;{new Date().getFullYear()}</span>
      <a href='mailto:scott@niftypixels.com'>
        Contact
      </a>
      <a href='//github.com/niftypixels/self-promotion/' target='_blank'>
        GitHub
      </a>
      <a href='//linkedin.com/in/niftypixels/' target='_blank'>
        LinkedIn
      </a>
      <a href='/Scott-Twede-Resume.pdf' target='_blank'>
        PDF
      </a>
    </footer>
  )
}

export default Footer;
