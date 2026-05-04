import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import '../styles/StateIndicator.scss';

const EXIT_MS = 500;

function StateIndicator({ text }) {
  const [shown, setShown] = useState(text);
  const [exiting, setExiting] = useState(false);
  const faceRef = useRef(null);

  useEffect(() => {
    if (text === shown) return;
    setExiting(true);
    const timer = setTimeout(() => {
      setShown(text);
      setExiting(false);
    }, EXIT_MS);
    return () => clearTimeout(timer);
  }, [text]);

  useLayoutEffect(() => {
    const el = faceRef.current;
    if (!exiting || !el) return;
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  }, [exiting]);

  return (
    <div id='state-indicator'>
      <div
        ref={faceRef}
        key={shown}
        className={`face${exiting ? ' exiting' : ''}`}
      >
        {shown && <span>{shown}</span>}
      </div>
    </div>
  );
}

export default StateIndicator;
