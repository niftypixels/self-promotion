import '../styles/Experience.scss';

const JOBS = [
  {
    company: 'Sony Interactive Entertainment',
    startDate: new Date('7/1/2014'),
    endDate: new Date('12/1/2023'),
    location: 'Aliso Viejo + San Francisco, CA',
    role: 'Tech Lead, Senior Software Engineer'
  },
  {
    company: 'RED Interactive Agency',
    startDate: new Date('9/1/2010'),
    endDate: new Date('6/1/2014'),
    location: 'Santa Monica, CA',
    role: 'Front-end Engineer'
  }
];

const AWARDS = [
  {
    date: new Date('6/22/14'),
    href: '//thefwa.com/cases/el-rey-network',
    project: "El Rey Network"
  },
  {
    date: new Date('2/5/13'),
    href: '//thefwa.com/cases/ufc-social',
    project: "UFC Social"
  },
  {
    date: new Date('2/24/12'),
    href: '//thefwa.com/cases/the-hunt-for-the-golden-pistachio',
    project: "The Hunt for the Golden Pistachio"
  },
  {
    date: new Date('12/4/11'),
    href: '//thefwa.com/cases/lucasfilm-s-star-wars-visualizer',
    project: "Lucasfilm's Star Wars Visualizer"
  }
];

function Experience() {
  const monthYear = (date) => date.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <section className='container' id='experience'>
      <div>
        {JOBS.map(({ company, startDate, endDate, location, role }, index) => (
          <h3 className='blob' style={{ '--bob-delay': '0s' }} key={index}>
            <strong>{company}</strong>
            <span>
              {monthYear(startDate)} &mdash; {monthYear(endDate)}
              <br /> &raquo; {location}
            </span>
            {role}
          </h3>
        ))}

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
                {date.toDateString().slice(4)}
              </li>
            ))}
          </ul>
        </aside>

      </div>
    </section>
  );
}

export default Experience;
