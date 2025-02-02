import { useEffect, useRef, useState } from 'react';
import useInterval from './hooks/useInterval';
import './About.scss';

function About() {
  return (
    <section id='about'>
      <div className='experience'>
        <h1>EXPERIENCE</h1>
        <h2>Sony Interactive Entertainment</h2>
        <code>July 2014 &mdash; December 2023, Aliso Viejo, CA</code>
        <h2>RED Interactive Agency</h2>
        <code>September 2010 &mdash; June 2014, Santa Monica, CA</code>
      </div>
      <aside className='awards'>
        <h2>AWARDS</h2>
        <h3>FWA of the Day</h3>
        <ul>
          <li>
            <a href='https://thefwa.com/cases/lucasfilm-s-star-wars-visualizer' target='_blank'>
              Lucasfilm's Star Wars Visualizer
            </a>
          </li>
          <li>
            <a href='https://thefwa.com/cases/the-hunt-for-the-golden-pistachio' target='_blank'>
              The Hunt for the Golden Pistachio
            </a>
          </li>
          <li>
            <a href='https://thefwa.com/cases/ufc-social' target='_blank'>
              UFC Social
            </a>
          </li>
          <li>
            <a href='https://thefwa.com/cases/el-rey-network' target='_blank'>
              El Rey Network
            </a>
          </li>
        </ul>
      </aside>
    </section>
  )
}

export default About;
