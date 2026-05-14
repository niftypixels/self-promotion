import '../styles/Magic8Ball.scss';

function Magic8Ball({ focus = face1 }) {
  return (
    <div id='magic8ball'>
      <div className='face1'>sadmac</div>
      <div className='face2'>email</div>
      <div className='face3'>github</div>
      <div className='face4'>linkedin</div>
      <div className='face5'>pdf</div>
      <div className='face6'>happymac</div>
    </div>
  )
}

export default Magic8Ball;
