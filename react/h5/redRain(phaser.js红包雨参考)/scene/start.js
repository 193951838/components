import Phaser from 'phaser';
import { IMAGE_LIST } from '../const';

export default class Start extends Phaser.Scene {
  constructor() {
    super('start');
  }

  init() {
    this.centerX = this.game.canvas.width / 2;
    this.centerY = this.game.canvas.height / 2;
    this.countdownFrameIndex = 0; //倒计时显示帧
  }

  preload() {
    IMAGE_LIST.forEach((item) => {
      const { key, url, type, ...options } = item;

      if (type === 'image') {
        this.load.image(key, url);
      }
      if (type === 'spriteSheet') {
        this.load.spritesheet(key, url, options);
      }
    });
  }

  create() {
    const { centerX, centerY } = this;

    this.add.image(0, 0, 'gameBg').setScale(0.5).setOrigin(0, 0); //背景图
    this.animationStart = this.add
      .sprite(centerX, centerY, 'animationStart', 0)
      .setDepth(1)
      .setScale(0.5); //倒计时精灵图
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        //播放倒计时
        if (this.countdownFrameIndex < 3) {
          this.countdownFrameIndex++;
          this.animationStart.setFrame(this.countdownFrameIndex);
        } else {
          this.scene.start('play');
        }
      },
    });
  }
}
