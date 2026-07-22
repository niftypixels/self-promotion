import { useEffect, useState } from 'react';

export default function useTabVisible() {
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const onChange = () => setIsVisible(!document.hidden);

    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  return isVisible;
}
