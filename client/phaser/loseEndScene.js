import store from '../store';
import Phaser from 'phaser';

export default class LoseEndScene extends Phaser.Scene {
  constructor() {
    // passing 'play' as a parameter that will serve as the identifier for this scene
    super('losing');
  }
  init() {
    // used to prepare data
  }
  preload() {
    // used to load assest like images and audio into memory
  }
  create() {
    this.add.text(0, 0, 'Grace Hopper says: GAME OVER LOSER', {
      fontFamily: '"Roboto Condensed"'
    });
    // adds objects to the game
    // you can navigate to the next scene like this
    //this.scene.start('play');
  }
  update() {
    // the game loop which runs constantly
  }
}
