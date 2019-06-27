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
    this.load.tilemapCSV('map', 'assets/actualHopperTiles.csv');
    this.load.image('colors', 'assets/tileset.png');
  }
  create() {
    // adds objects to the game
    this.add.image(400, 300, 'sky');
    this.add.image(400, 300, 'colors');

    const map = this.make.tilemap({key: 'map', tileWidth: 16, tileHeight: 16});
    const tileset = map.addTilesetImage('colors');
    const layer = map.createDynamicLayer(0, tileset, 0, 0);
  }
  update() {
    // the game loop which runs constantly
  }
}
