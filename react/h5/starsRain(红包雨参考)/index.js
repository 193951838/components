import React from 'react';
import Modal from 'components/modal';
import { withRouter } from 'react-router-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { luckyDraw } from 'api/index';
import Wheel from 'components/wheel';
import bg from 'assets/images/meteor/bg.jpg';
import titleText from 'assets/images/meteor/titleText.png';
import lion from 'assets/images/meteor/lion.png';
import titleGame from 'assets/images/meteor/titleGame.png';
import go from 'assets/images/meteor/go.png';
import one from 'assets/images/meteor/one.png';
import two from 'assets/images/meteor/two.png';
import three from 'assets/images/meteor/three.png';
import start1 from 'assets/images/meteor/start1.png';
import start2 from 'assets/images/meteor/start2.png';
import start3 from 'assets/images/meteor/start3.png';
import { Toast } from 'antd-mobile';
import css from './index.less';

let starts = [start1, start2, start3];
let downTimeImgs = [three, two, one, go];
let downTimeFun = null; // 开始前倒计时
let gameDownTimeFun = null; // 游戏倒计时
let timerTem = null; // 生成红包计时器
let redCount = 0;
const StarsRain = (props) => {
  React.useEffect(() => {
    // init();
    // handleDownTime();
    // redCount = 0;
    // return () => {
    //   if (window.rainMusic) window.rainMusic.pause();
    // };
  }, []);

  let [downTime, setDownTime] = React.useState(0); // 游戏开始倒计时 4 不显示 0 1 2 3
  let [gameTime, setGameTime] = React.useState(10); // 游戏中倒计时
  const [isGame, setIsGame] = React.useState(false); // 游戏是否开始
  let [hongBaoArr, setHongBao] = React.useState([]); // 红包数组
  let [showWheel, setShowWheel] = React.useState(false); // 大转盘弹窗
  let [actIndex, setActIndex] = React.useState(null); // 当前点击的红包
  // const [redCount, setRedCount] = React.useState(0); // 殿中红包个数

  // 初始化
  function init() {
    clearInterval(downTimeFun);
    downTimeFun = null;
    clearInterval(gameDownTimeFun);
    gameDownTimeFun = null;
    clearTimeout(timerTem);
    timerTem = null;
    setDownTime(0);
    setGameTime(10);
    setIsGame(false);
  }

  // 游戏开始前倒计时
  function handleDownTime() {
    downTimeFun = setInterval(() => {
      ++downTime;
      setDownTime(downTime);
      if (downTime > 3) {
        clearInterval(downTimeFun);
        downTimeFun = null;
        handleGameDownTime();
        // setDownTime(0);
      }
      // console.log(downTime , 'downTime === >>')
    }, 1000);
  }

  // 游戏倒计时
  function handleGameDownTime() {
    if (window.rainMusic) window.rainMusic.play();
    if (window.game) window.game.pause();

    getHongBao();
    setIsGame(true);

    gameDownTimeFun = setInterval(() => {
      --gameTime;
      setGameTime(gameTime);

      if (gameTime == 0) {
        if (redCount > 0) {
          setTimeout(() => {
            postLuckyDraw();
          }, 3000);
        }
        clearInterval(gameDownTimeFun);
        gameDownTimeFun = null;
        setIsGame(false);
        setTimeout(() => {
          setShowWheel(true);
        }, 5000);
      }
      // console.log(downTime , 'downTime === >>')
    }, 1000);
  }

  // 生成红包雨
  function getHongBao() {
    let random = Math.floor(Math.random() * 2); // 0 1 2
    let renLeft = [
      Math.ceil(Math.random() * (350 - 50) + 50),
      Math.ceil(Math.random() * (700 - 350) + 350),
    ];
    let jiaodu = Math.ceil(Math.random() * 80) - 15; // Math.ceil(Math.random() * 80) - 15
    let marginLeft = renLeft[random];
    let width = Math.floor(Math.random() * (70 - 40) + 40);
    let animation = Math.floor(Math.random() * (14 - 8) + 8); // 下落时间
    let url = starts[random];
    // console.log(Math.floor(Math.random() * 4), 'Math.floor(Math.random() * 4) === >>>');
    // console.log(marginLeft);
    let hongBao = {
      jiaodu: jiaodu,
      marginleft: marginLeft,
      width: width,
      height: width,
      animation: animation,
      url: url,
      isOpen: false,
      isPlay: true,
    };
    hongBaoArr.push(hongBao);
    setHongBao(hongBaoArr);
    if (gameTime <= 0) {
      clearTimeout(timerTem);
      timerTem = null;
    } else {
      timerTem = setTimeout(() => {
        getHongBao();
      }, 400); // 密度
    }
  }

  // 倒计时
  function renderTime() {
    // console.log(downTime , '11 downTime === >>')
    return (
      <div>
        <Modal visible={downTime > 3 ? false : true} isClose={false}>
          <div className={css.timeBox}>
            <img className={css.title} src={titleGame} alt="" />
            <img className={css.go} src={downTimeImgs[downTime]} alt="" />
          </div>
        </Modal>
      </div>
    );
  }

  // 游戏暂停 开启
  function stopGame() {
    if (gameTime <= 0) return;
    if (isGame) {
      setIsGame(false);

      hongBaoArr.forEach((item) => (item.isPlay = false));
      setHongBao(hongBaoArr);
      clearInterval(gameDownTimeFun);
      gameDownTimeFun = null;
      clearTimeout(timerTem);
      timerTem = null;
    } else {
      hongBaoArr.forEach((item) => (item.isPlay = true));
      setHongBao(hongBaoArr);

      handleGameDownTime();
    }
  }

  // 点击红包抽奖
  function handlePackage(index) {
    // setRedCount(1);
    redCount = 1;
    setActIndex(index);
    console.log(index, 'index === >>>');
  }

  // 红包雨抽奖
  async function postLuckyDraw() {
    console.log('抽奖 === >>>');
    let detect = '';
    let dfpToken = '';
    galaxie.security.getDfpToken((err, data) => {
      dfpToken = data;
    }); //获取设备指纹
    galaxie.security.getDetect((err, data) => {
      detect = data;
    }); //获取人机验证参数
    try {
      const res = await luckyDraw(1, detect, dfpToken);
      Toast.info(
        `${res.name ? '恭喜获得' + res.name : '您未中奖'}!`,
        2,
        undefined,
        false
      );
      // console.log(index, "抢红包 === 》》》");
    } catch (error) {}
  }

  // 关闭弹窗
  function handleCloseWheel() {
    setShowWheel(false);
    props.history.goBack();
    // stopGame();
  }

  // 红包雨
  function renderGame() {
    // console.log(hongBaoArr, 'hongBaoArr === >>')
    return (
      <div
        className={css.renderGame}
        // onClick={() => stopGame()}
      >
        {hongBaoArr.map((item, index) => {
          return (
            <div
              className={css.gameStart}
              key={`renderGame${index}`}
              style={{
                right: `${item.marginleft / 2}px`,
                width: `${item.width}px`,
                height: `${item.height}px`,
                animationDuration: `${item.animation}s`,
                animationPlayState: item.isPlay ? 'running' : 'paused',
              }}
              onTouchStart={() => handlePackage(index)}
            >
              <img
                className={classNames(css.hongBao, {
                  [css.noGame]: index == actIndex,
                })}
                src={item.url}
                alt=""
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={css.starsRain}
      style={{
        background: `url(${bg})`,
        backgroundSize: '100% 100%',
      }}
    >
      <img className={css.titleText} src={titleText} alt="" />
      <img className={css.lion} src={lion} alt="" />
      <div className={css.gameTime}>
        {gameTime < 10 ? `0${gameTime}` : gameTime}秒
      </div>
      {renderTime()}
      {renderGame()}
      <Wheel onClose={() => handleCloseWheel()} visible={true} />
      {/* 111 */}
    </div>
  );
};

StarsRain.propTypes = {};

StarsRain.defaultProps = {};

export default withRouter(StarsRain);
