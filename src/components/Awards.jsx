import '../styles/Awards.scss';

const AWARDS = [
  {
    award: 'FWA Mobile of the Day',
    date: new Date('6/22/14'),
    href: '//thefwa.com/cases/el-rey-network',
    project: "El Rey Network"
  },
  {
    award: 'FWA of the Day',
    date: new Date('2/5/13'),
    href: '//thefwa.com/cases/ufc-social',
    project: "UFC Social"
  },
  {
    award: 'FWA of the Day',
    date: new Date('2/24/12'),
    href: '//thefwa.com/cases/the-hunt-for-the-golden-pistachio',
    project: "The Hunt for the Golden Pistachio"
  },
  {
    award: 'FWA of the Day',
    date: new Date('12/4/11'),
    href: '//thefwa.com/cases/lucasfilm-s-star-wars-visualizer',
    project: "Lucasfilm's Star Wars Visualizer"
  }
];

function Awards() {
  return (
    <div id='awards'>
      <div className='dispenser'>
        &#9733;
      </div>
      <a className='tape'>
        <strong>{AWARDS[0].project}</strong>
        <small>{AWARDS[0].award}, {AWARDS[0].date.toDateString().slice(4)}</small>
      </a>

{/*
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
 */}

    </div>
  );
}

export default Awards;
