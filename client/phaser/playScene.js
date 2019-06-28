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

    // adds objects to the game
    this.add.image(400, 300, 'colors');

    const map = this.make.tilemap({key: 'map', tileWidth: 50, tileHeight: 50});
    const tileset = map.addTilesetImage('colors');
    this.layer = map.createDynamicLayer(0, tileset, 0, 0);

    this.ship = new Ship(this, 500, 255);

    // the indicies for the different kinds of tiles
    this.tileValues = {
      regularTile: 565,
      borderTile: 1204,
      harborTile: 363,
      pathTile: 363
    };

    // this.ship.sprite.setCollideWorldBounds(true);

    // have the camera follow the sprite
    this.cameras.main.startFollow(this.ship.sprite);
    // make sure camera cant leave the world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }
  update() {
    // the game loop which runs constantly
    this.ship.update();
  }
}
