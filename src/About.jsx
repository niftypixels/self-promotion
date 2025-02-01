import { useEffect, useRef, useState } from 'react';
import useInterval from './hooks/useInterval';
import './About.scss';

function About() {
  return (
    <section id='about'>
      <div className='experience'>
        <h1>Experience</h1>
        <h3>Sony Interactive Entertainment</h3>
        <h3>RED Interactive Agency</h3>
      </div>
      <div className='awards'>
        <h1>Awards</h1>
        <h3>FWA of the Day</h3>
        <ul>
          <li>
            <a href='https://thefwa.com/cases/lucasfilm-s-star-wars-visualizer'>
              Lucasfilm's Star Wars Visualizer
            </a>
          </li>
          <li>
            <a href='https://thefwa.com/cases/the-hunt-for-the-golden-pistachio'>
              The Hunt for the Golden Pistachio
            </a>
          </li>
          <li>
            <a href='https://thefwa.com/cases/ufc-social'>
              UFC Social
            </a>
          </li>
          <li>
            <a href='https://thefwa.com/cases/el-rey-network'>
              El Rey Network
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}

export default About;
