import store from '../store';
import Phaser from 'phaser';
import Ship from './ship';

export default class PlayScene extends Phaser.Scene {
  constructor() {
    // passing 'play' as a parameter that will serve as the identifier for this scene
    super('play');
  }
  init() {
    // used to prepare data
  }
  preload() {
    // used to load assets like images and audio into memory

    this.load.spritesheet('ship', 'assets/shipsprite.png', {
      frameWidth: 49,
      frameHeight: 50,
      margin: 1,
      spacing: 2
    });

    this.load.image('tiles', 'assets/sky.png');
  }
  create() {
    // adds objects to the game
    this.add.image(400, 300, 'tiles');
    this.ship = new Ship(this, 200, 200);
  }
  update() {
    // the game loop which runs constantly
    this.ship.update();
  }
}
