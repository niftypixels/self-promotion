import '../styles/LavaMask.scss';

function LavaMask({ flip = false }) {
  return (
    <div className={flip && 'lava-mask-flip'}>
      <div className='lava-mask' aria-hidden='true' />
    </div>
  );
}

export default LavaMask;
