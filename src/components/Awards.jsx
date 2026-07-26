import '../styles/Awards.scss';

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

function Awards() {
  return (
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
  );
}

export default Awards;
