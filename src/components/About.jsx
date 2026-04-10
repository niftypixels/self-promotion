import '../styles/About.scss';

export const ABOUT = 'I am a software engineer with over a decade of expertise crafting creative interactive experiences for top global brands including PlayStation, Samsung, Nvidia, ESPN, Disney, Paramount, Lionsgate, HBO, and UFC — just to name a few.';

function About() {
  return (
    <section className='container' id='about'>
      <p>{ABOUT}</p>
    </section>
  );
}

export default About;
