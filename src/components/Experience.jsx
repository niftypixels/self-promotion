import { Awards } from '.';
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

function Experience() {
  const monthYear = (date) => date.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <section className='container' id='experience'>
      <div>
        {JOBS.map(({ company, startDate, endDate, location, role }, index) => (
          <article key={index}>
            <h3>{company}</h3>
            <span>
              {monthYear(startDate)} &mdash; {monthYear(endDate)}
              <br /> &raquo; {location}
            </span>
            <p>{role}</p>
          </article>
        ))}
        <Awards />
      </div>
    </section>
  );
}

export default Experience;
