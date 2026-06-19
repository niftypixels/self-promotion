import '../styles/Experience.scss';

function Experience() {
  return (
    <section className='container' id='experience'>
      <div>

        <article className='blob' style={{ '--bob-delay': '0s' }}>
          <strong>Sony Interactive Entertainment</strong>
          <p>Tech Lead, Senior Software Engineer</p>
          <span>07/2014 &mdash; 12/2023 &bull; Aliso Viejo + San Francisco, CA</span>
        </article>

        <article className='blob' style={{ '--bob-delay': '0.6s' }}>
          <strong>RED Interactive Agency</strong>
          <p>Front-end Engineer</p>
          <span>09/2010 &mdash; 06/2014 &bull; Santa Monica, CA</span>
        </article>

        <aside className='blob' style={{ '--bob-delay': '1.3s' }}>
          <strong>Awards</strong>
          <p>FWA of the Day</p>
          <ul>
            <li>
              <a href='//thefwa.com/cases/el-rey-network' target='_blank'>
                El Rey Network
              </a>
            </li>
            <li>
              <a href='//thefwa.com/cases/ufc-social' target='_blank'>
                UFC Social
              </a>
            </li>
            <li>
              <a href='//thefwa.com/cases/the-hunt-for-the-golden-pistachio' target='_blank'>
                The Hunt for the Golden Pistachio
              </a>
            </li>
            <li>
              <a href='//thefwa.com/cases/lucasfilm-s-star-wars-visualizer' target='_blank'>
                Lucasfilm's Star Wars Visualizer
              </a>
            </li>
          </ul>
        </aside>

      </div>
    </section>
  );
}

export default Experience;
