import clientStore, {clientActionCreators} from '../store';
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
    const {gameState: {duration, playersKilled}} = clientStore.getState();
    this.gameOverText = this.add.text(
      400,
      300,
      `Grace Hopper says: GAME OVER LOSER

        Time Alive: ${duration} seconds`,
      {
        fontFamily: '"Audiowide", cursive',
        fontSize: '32px',
        textAlign: 'left'
      }
    );
    this.gameOverText.setOrigin(0.5);
    // adds objects to the game
    // you can navigate to the next scene like this
    //this.scene.start('play');
  }
  update() {
    // the game loop which runs constantly
  }
}
