import { Awards } from '.';
import '../styles/Experience.scss';

interface Job {
  company: string;
  startDate: Date;
  endDate: Date;
  location: string;
  role: string;
}

const JOBS: Job[] = [
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

const BOB_DELAYS = JOBS.map((_, index) => `${-(index * 1.5 + Math.random()).toFixed(2)}s`);

function Experience() {
  const monthYear = (date: Date) => date.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <section className='container' id='experience'>
      <div>
        {JOBS.map(({ company, startDate, endDate, location, role }, index) => (
          <article key={index} className='bobber' style={{ '--bob-delay': BOB_DELAYS[index] } as React.CSSProperties}>
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
