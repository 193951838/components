import Phaser from 'phaser';

export default class Play extends Phaser.Scene {
  constructor() {
    super('play');
  }

  init() {
    this.centerX = this.game.canvas.width / 2;
    this.centerY = this.game.canvas.height / 2;
  }

  create() {
    this.add.image(0, 0, 'gameBg').setScale(0.5).setOrigin(0, 0); //背景图
    this.starGroup = this.physics.add
      .group({
        //创建星星池
        maxSize: 10,
        defaultKey: 'star',
      })
      .setOrigin(0, 0);

    this.time.addEvent({
      delay: 300,
      loop: true,
      callback: this.createStar,
    });
  }

  update() {
    this.starGroup.children.iterate((star) => {
      if (star.y > this.game.canvas.height) {
        this.starGroup.killAndHide(star);
      }
    });
  }

  //创建星星
  createStar = () => {
    const stars = this.starGroup.get(
      Math.random() * (this.centerX * 2 - 150),
      -150
    );

    if (!stars) return;
    stars.setScale(0.5).setActive(true).setVisible(true);

    stars.setVelocity(Math.random() * 40, Math.random() * 100);
    stars.setInteractive();
    stars.once('pointerdown', () => {
      stars.setVisible(false);
    });
  };
}
