import store from '../store';
import Phaser from 'phaser';

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
    this.load.image('sky', 'assets/sky.png');
  }
  create() {
    // adds objects to the game
    this.add.image(400, 300, 'sky');
  }
  update() {
    // the game loop which runs constantly
  }
}
