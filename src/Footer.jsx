import './Footer.scss';

function Footer() {
  return (
    <section id='footer'>
      <div>
        <img src="/sadmac.png" alt="" />
        <p>Made with <strong>❤</strong> in OC</p>
        <span>SCOTT <br /> TWEDE <br /> &copy;{new Date().getFullYear()}</span>
      </div>
    </section>
  )
}

export default Footer;
