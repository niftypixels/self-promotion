import { useState } from 'react';
import { BackgroundStatic, Magic8Ball } from '.';
import '../styles/Footer.scss';

function Footer() {
  const [focus, setFocus] = useState(null);

  const face = (f) => ({ onMouseEnter: () => setFocus(f), onMouseLeave: () => setFocus(null) });

  return (
    <footer className='container'>
      <BackgroundStatic fps={30} />
      <img className='avatar' src='sadmac.png' alt='' />
      <Magic8Ball focus={focus} />
      <p>Made with <img src='heart.svg' alt='❤' /> in OC</p>
      <span>SCOTT <br /> TWEDE <br /> &copy;{new Date().getFullYear()}</span>
      <a href='mailto:scott@twede.dev' {...face('face1')}>
        Email
      </a>
      <a href='//github.com/niftypixels/self-promotion/' target='_blank' {...face('face2')}>
        GitHub
      </a>
      <a href='//linkedin.com/in/niftypixels/' target='_blank' {...face('face3')}>
        LinkedIn
      </a>
      <a href='Scott-Twede-Resume.pdf' target='_blank' {...face('face4')}>
        PDF
      </a>
    </footer>
  )
}

export default Footer;
