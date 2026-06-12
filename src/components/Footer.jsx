import { useState } from 'react';
import { BackgroundStatic, Magic8Ball } from '.';
import '../styles/Footer.scss';

function Footer() {
  const [focus, setFocus] = useState(null);
  const face = (f) => ({ onMouseEnter: () => setFocus(f), onMouseLeave: () => setFocus('face1') });

  return (
    <footer className='container'>
      <BackgroundStatic fps={30} />
      <Magic8Ball focus={focus} />
      <p>
        <a href='mailto:scott@twede.dev' {...face('face5')}>
          Email
        </a>
        <a href='//github.com/niftypixels/self-promotion/' target='_blank' {...face('face3')}>
          GitHub
        </a>
        <a href='//linkedin.com/in/niftypixels/' target='_blank' {...face('face4')}>
          LinkedIn
        </a>
        <a href='Scott-Twede-Resume.pdf' target='_blank' {...face('face6')}>
          PDF
        </a>
      </p>
      <p class='copyright'>SCOTT <br /> TWEDE <br /> &copy;{new Date().getFullYear()}</p>
      <p>Made with <img src='heart.svg' alt='❤' /> in OC</p>
    </footer>
  )
}

export default Footer;
