import '../styles/About.scss';

export const ABOUT = 'I have 20+ years of expertise building creative interactive applications for global brands including PlayStation, Samsung, ESPN, Disney, Paramount, Lionsgate, HBO, and UFC.\n\nCurrently consulting; open to contract and full-time opportunities.';

function About() {
  return (
    <section className='container' id='about'>
      <p>{ABOUT}</p>
    </section>
  );
}

export default About;
