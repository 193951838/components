
//简单的红包雨demo
import React, { Fragment } from "react";
import css from "./index.less";

const initY = -200; //初始位置
const imgW = 134;
const imgH = 181;
const numLimit = {
  //顶部出现红包数量区间
  max: 5,
  min: 1
};

const redRainImg = [
  {
    key: 1,
    url:
      "https://img.alicdn.com/imgextra/i2/4074958541/O1CN01A6ZLy92CxpPQ3zgiO_!!4074958541.png"
  },
  {
    key: 2,
    url:
      "https://img.alicdn.com/imgextra/i4/4074958541/O1CN01Otewfx2CxpPV4PsC7_!!4074958541.png"
  }
];

export default class RedRain extends React.Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      playTime: 20, ////游戏时间s
      clickArr: []
    };
  }

  componentDidMount() {
    let { playTime } = this.state;
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.containerWidth = this.canvas.width = window.innerWidth;
    this.containerHeight = this.canvas.height = window.innerHeight;
    this.redRainArray = [];
    this.ctx.fillStyle = "rgba(0, 0, 0, .1)";
    this.startCreate();
    this.move();
    this.canvas.addEventListener("click", this.handleClick);
    this.closeTime = setInterval(() => {
      if (playTime < 0) {
        this.clearTimer();
        console.log("结束红包雨", this.moveTimer);
        return;
      }
      this.setState({
        playTime: playTime--
      });
    }, 1000);
  }

  componentWillUnmount() {
    this.clearTimer();
    this.canvas.removeEventListener("click", this.handleClick);
  }

  /**
   * 清除所点击红包
   * @param {*} e
   */

  handleClick = e => {
    const { pageX, pageY } = e;
    let { clickArr } = this.state;
    const clickIndex = this.redRainArray.findIndex(item => {
      const { x, y } = item;
      console.log(x <= pageX && pageX <= x + imgW);
      return x <= pageX && pageX <= x + imgW && y <= pageY && pageY <= y + imgH;
    });
    console.log("clickIndex", clickIndex);
    if (clickIndex > -1) {
      this.setState({
        clickArr: { ...clickArr, ...this.redRainArray[clickIndex] }
      });
      this.redRainArray.splice(clickIndex, 1);
    }
  };

  /**
   * 清理定时器
   */
  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.moveTime) {
      cancelAnimationFrame(this.moveTimer);
      this.moveTimer = null;
    }
    if (this.closeTime) {
      clearTimeout(this.closeTime);
      this.closeTime = null;
    }
  }

  /**
   * 创建红包
   */
  startCreate() {
    const { max, min } = numLimit;

    const num = Math.random() * (max - min) + min;
    for (let i = 0; i < num; i++) {
      const obj = this.init();
      this.redRainArray.push(obj);
    }
    this.timer = setTimeout(() => {
      this.redRainArray = this.redRainArray.filter(
        //过滤超出界面的红包对象
        item => item.y < this.containerHeight
      );

      this.startCreate();
    }, 1000);
  }

  /**
   * 生成的红包的x坐标,生成的红包不能互相重叠
   */
  get getX() {
    const x = Math.random() * (this.containerWidth - 134);
    const isRepeat = this.redRainArray.some(
      item => item.y === initY && Math.abs(x - item.x) < imgW
    );

    if (isRepeat) return this.getX;
    return x;
  }

  /**
   * 初始化单个红包属性
   */
  init() {
    const { containerWidth } = this;
    const imgItem = redRainImg[Math.floor(Math.random() * redRainImg.length)];
    const imgObj = new Image();
    imgObj.src = imgItem.url;
    return {
      img: {
        imgUrl: imgObj,
        key: imgItem.key
      },
      x: this.getX,
      y: initY,
      speed: 3,
      angle: (Math.random() * 270 * 5 * Math.PI) / 180, //旋转角度
      w: imgW, //红包宽度
      h: imgH //红包高度
    };
  }

  draw() {
    //开始构建红包
    const { containerHeight, ctx, redRainArray } = this;
    const arr = redRainArray.filter(item => item.y < containerHeight);
    arr.forEach((item, index) => {
      const {
        y,
        img: { imgUrl },
        x,
        w,
        h
      } = item;
      if (item.y < containerHeight) {
        item.speed = item.speed * 1.008;
        item.y += item.speed;
        arr.splice(index, 1, item);
        ctx.drawImage(imgUrl, x, y, w, h);
      }
    });
    this.redRainArray = arr;
  }

  /**
   * 清空canvas绘制新的一帧动画
   */
  move() {
    this.ctx.clearRect(0, 0, this.containerWidth, this.containerHeight);
    this.draw();
    this.moveTimer = window.requestAnimationFrame(() => this.move());
  }

  render() {
    const { playTime } = this.state;
    return (
      <div className={css.container}>
        <canvas id="canvas" className={css.canvas} />
        <div className={css.timerBox}>
          <span>剩余时间</span>
          <span className={css.time}>
            0:{playTime < 10 ? "0" + playTime : playTime}
          </span>
        </div>
      </div>
    );
  }
}
