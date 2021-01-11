import React from 'react';
import Phaser from 'phaser';
import Start from './scene/start';
import Play from './scene/play';

const canvasW = window.innerWidth;
const canvasH = window.innerHeight;
const RedRain = () => {
  React.useEffect(() => {
    new Phaser.Game({
      type: Phaser.AUTO,
      autoCenter: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
      width: canvasW,
      height: canvasH,
      scene: [Start, Play],
      backgroundColor: 'blue',
      physics: {
        default: 'arcade',
        arcade: {
          // 重力加速度
          gravity: { x: 20, y: 80 },
        },
      },
    });
  }, []);
  return null;
};

export default RedRain;
