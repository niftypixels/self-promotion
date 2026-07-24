import '../styles/Experience.scss';

const AWARDS = [
  {
    date: new Date('6/22/14'),
    href: '//thefwa.com/cases/el-rey-network',
    project: "El Rey Network",
  },
  {
    date: new Date('2/5/13'),
    href: '//thefwa.com/cases/ufc-social',
    project: "UFC Social",
  },
  {
    date: new Date('2/24/12'),
    href: '//thefwa.com/cases/the-hunt-for-the-golden-pistachio',
    project: "The Hunt for the Golden Pistachio",
  },
  {
    date: new Date('12/4/11'),
    href: '//thefwa.com/cases/lucasfilm-s-star-wars-visualizer',
    project: "Lucasfilm's Star Wars Visualizer",
  },
];

function Experience() {
  return (
    <section className='container' id='experience'>
      <div>

        <h3 className='blob' style={{ '--bob-delay': '0s' }}>
          <strong>Sony Interactive Entertainment</strong>
          <span>07/2014 &mdash; 12/2023 <br /> &raquo; Aliso Viejo + San Francisco, CA</span>
          Tech Lead, Senior Software Engineer
        </h3>

        <h3 className='blob' style={{ '--bob-delay': '0.5s' }}>
          <strong>RED Interactive Agency</strong>
          <span>09/2010 &mdash; 06/2014 <br /> &raquo; Santa Monica, CA</span>
          Front-end Engineer
        </h3>

        <aside className='blob' style={{ '--bob-delay': '1.3s' }}>
          <h3>
            <strong>Awards</strong>
            FWA of the Day
          </h3>
          <ul>
            {AWARDS.map(({ date, href, project }) => (
              <li key={href}>
                <a href={href} target='_blank'>
                  {project}
                </a>
                {/* {date.toDateString().slice(4)} */}
              </li>
            ))}
          </ul>
        </aside>

      </div>
    </section>
  );
}

export default Experience;
