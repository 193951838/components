import React, { Fragment } from "react";
import css from "./index.less";
import Phaser from "phaser";
import PropTypes from "prop-types";

const winW = window.innerWidth;
const winH = window.innerHeight;

export default class PhaserRedRain extends React.Component {
  static propTypes = {
    backgroundUrl: PropTypes.string,
    redRainUrl: PropTypes.string,
    imgW: PropTypes.number, //红包宽
    imgH: PropTypes.number, //红包高
    max: PropTypes.number,
    min: PropTypes.number,
    gradeImg: PropTypes.string,
    initY: PropTypes.number, //红包初始Y位置
    gradeImgW: PropTypes.number, //分数图片宽
    gradeImgH: PropTypes.number, //分数图片高
    onEnd: PropTypes.func,
    titleUrl: PropTypes.string
  };

  static defaultProps = {
    initY: -200,
    titleUrl:
      "https://img.alicdn.com/imgextra/i1/4074958541/O1CN01cpq8qA2CxpPS6Qdtn_!!4074958541.png",
    min: 0,
    max: 4,
    imgW: 134,
    imgH: 181,
    gradeImgW: 661,
    gradeImgH: 567,
    gradeImg:
      "https://img.alicdn.com/imgextra/i2/4074958541/O1CN01oJiUuw2CxpPS6RmZ8_!!4074958541.png",
    backgroundUrl:
      "https://img.alicdn.com/imgextra/i4/4074958541/O1CN01abQyxs2CxpPSUvp8j_!!4074958541.png",
    redRainUrl:
      "https://img.alicdn.com/imgextra/i2/4074958541/O1CN01A6ZLy92CxpPQ3zgiO_!!4074958541.png",
    onEnd: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      startTime: 5,
      playTime: 20
    };
  }

  componentDidMount() {
    this.startTime();
    const config = {
      type: Phaser.AUTO,
      width: winW,
      height: winH,
      parent: "box",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 300 }
        }
      },
      scene: {
        preload: this.preload,
        create: this.create
      }
    };

    this.game = new Phaser.Game(config);
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  /**
   * 清理定时器并销毁游戏
   */
  clearTimer() {
    if (this.closeTime) {
      clearTimeout(this.closeTime);
      this.closeTime = null;
    }
    if (this.game) {
      this.game.destroy();
    }
  }

  /**
   * 定时
   */
  startTime() {
    let { playTime } = this.state;
    this.closeTime = setInterval(() => {
      if (playTime < 0) {
        this.clearTimer();
        this.props.onEnd();
        return;
      }
      this.setState({
        playTime: playTime--
      });
    }, 1000);
  }

  /**
   * 加载所需文件资源
   */
  preload = () => {
    const { redRainUrl, backgroundUrl, gradeImg } = this.props;
    const [scene] = this.game.scene.scenes; //取第一个进程
    scene.load.image("backgroundImg", backgroundUrl); //加载背景图片
    scene.load.image("img", redRainUrl); //加载红包图片
    scene.load.image("grade", gradeImg);
  };

  create = () => {
    const [scene] = this.game.scene.scenes;
    scene.add.image(0, 0, "backgroundImg").setOrigin(0, 0);
    this.grade = scene.add
      .image(0, 0, "grade")
      .setVisible(false)
      .setOrigin(0, 0)
      .setDepth(1);

    scene.time.addEvent({
      delay: 1000,
      callback: this.init,
      loop: true
    });
  };

  /**
   * 初始化生成红包
   */
  init = () => {
    const [scene] = this.game.scene.scenes;
    const { max, min, initY, imgW, redRainUrl } = this.props;
    const num = Math.random() * (max - min) + min;
    const deg = Math.random() * 270;
    const x = (Math.random() * winW) / num + imgW / 2;
    const playerGroup = scene.physics.add
      .group({
        key: "img",
        repeat: num,
        setXY: {
          x,
          y: initY,
          stepX: (winW - x) / num
        }
      })
      .rotate(deg, deg)
      .setVelocity(0, 200, 0);

    this.click(playerGroup, scene);
  };

  /**
   * 点击红包
   */
  click(playerGroup) {
    const [scene] = this.game.scene.scenes;
    const { gradeImgW, gradeImgH } = this.props;
    const { entries } = playerGroup.children;
    let isGrade = false;
    scene.input.on("pointerdown", e => {
      isGrade = true;
      for (let i = 0; i < entries.length; i++) {
        if (entries[i].getBounds().contains(e.x, e.y)) {
          playerGroup.remove(entries[i], true, true);
          i--;
          const gradeX =
            e.x > winW - gradeImgW / 2 ? winW - gradeImgW + 180 : e.x - 200;
          const gradeY = e.y > winH - gradeImgH ? winH - gradeImgH : e.y - 300;
          this.grade
            .setVisible(true)
            .setX(gradeX)
            .setY(gradeY);
          break;
        }
      }
    });

    scene.time.addEvent({
      //隐藏点击红包提示
      delay: 800,
      callback: () => {
        if (!isGrade) {
          this.grade.setVisible(false);
          isGrade = false;
        }
      }
    });
  }

  render() {
    const { playTime } = this.state;
    const { titleUrl } = this.props;
    return (
      <div id="box" className={css.box}>
        <img src={titleUrl} className={css.titleUrl} alt="" />
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
