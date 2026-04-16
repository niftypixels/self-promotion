import '../styles/LavaMask.scss';

function LavaMask({ bottom = false, reverse = false }) {
  const src = bottom ? '/lava-mask-bottom.svg' : '/lava-mask.svg';
  const classes = ['lava-mask', bottom && 'bottom', reverse && 'reverse'].filter(Boolean).join(' ');
  return (
    <div
      className={classes}
      style={{ backgroundImage: `url(${src})` }}
      aria-hidden='true'
    />
  );
}

export default LavaMask;
