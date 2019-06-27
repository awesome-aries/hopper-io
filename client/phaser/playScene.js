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
    this.load.spritesheet('ship', 'assets/shipsprite.png', {
      frameWidth: 49,
      frameHeight: 50
      //margin: 1,
      // spacing: 2
    });

    this.load.tilemapCSV('map', 'assets/hopperiotiles.csv');
    this.load.image('colors', 'assets/tileset.png');
  }
  create() {
    // adds objects to the game

    this.ship = new Ship(this, 200, 200);

    // adds objects to the game
    this.add.image(400, 300, 'colors');

    const map = this.make.tilemap({key: 'map', tileWidth: 50, tileHeight: 50});
    const tileset = map.addTilesetImage('colors');
    const layer = map.createDynamicLayer(0, tileset, 0, 0);
  }
  update() {
    // the game loop which runs constantly
    this.ship.update();
  }
}
