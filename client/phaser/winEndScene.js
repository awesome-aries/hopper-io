import store from '../store';
import Phaser from 'phaser';

export default class WinEndScene extends Phaser.Scene {
  constructor() {
    // passing 'play' as a parameter that will serve as the identifier for this scene
    super('winning');
  }
  init() {
    // used to prepare data
  }
  preload() {
    // used to load assest like images and audio into memory
  }
  create() {
    // adds objects to the game
    // you can navigate to the next scene like this
    this.scene.start('play');
  }
  update() {
    // the game loop which runs constantly
  }
}
