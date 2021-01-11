import React from 'react';
import tigerImg from './const/images/compoundPush-gb.jpg';
import classNames from 'classnames';
import css from './index.less';

const SLOT_LIST = [
  {
    url: tigerImg,
  },
];

const defaultProps = {
  circle: 20,
  speed: 200,
};

let y = 0;
let nowCircle = 1;
const TigerGame = React.memo((props) => {
  const [lateY, setLateY] = React.useState(0);

  function getY() {
    if (y < 480) {
      const { speed } = defaultProps;

      y = y + speed;
      setLateY(y);
    } else {
      y = 0;
      nowCircle++;
      setLateY(0);
    }
  }

  function start() {
    const { circle } = defaultProps;
    getY();
    const animation = requestAnimationFrame(start);

    if (nowCircle === circle) {
      clear();
      cancelAnimationFrame(animation);
    }
  }

  //清理
  function clear() {
    nowCircle = 0;
    y = 0;
  }

  return (
    <div className={css.container}>
      <div className={css.box}>
        {SLOT_LIST.map((item) => {
          return (
            <div key={item} style={{ transform: `translateY(${-lateY}px)` }}>
              <img src={tigerImg} className={css.item} />
              <img src={tigerImg} className={css.item} />
            </div>
          );
        })}
      </div>
      <button onClick={start}>开始</button>
    </div>
  );
});

export default TigerGame;
