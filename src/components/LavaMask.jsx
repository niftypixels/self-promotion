import '../styles/LavaMask.scss';

function LavaMask({ bottom = false }) {
  const src = bottom ? '/lava-mask-bottom.svg' : '/lava-mask.svg';
  return (
    <div
      className={bottom ? 'lava-mask bottom' : 'lava-mask'}
      style={{ backgroundImage: `url(${src})` }}
      aria-hidden='true'
    />
  );
}

export default LavaMask;
