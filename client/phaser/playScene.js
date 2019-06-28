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
    this.load.spritesheet('ship', 'assets/shipspritealpha.png', {
      frameWidth: 49,
      frameHeight: 50
      //margin: 1,
      // spacing: 2
    });

    this.load.tilemapCSV('map', 'assets/testtilemap.csv');
    this.load.image('colors', 'assets/test-tile-set50x50tiles.png');
  }

  create() {
    // adds objects to the game

    // adds objects to the game
    this.add.image(400, 300, 'colors');

    const map = this.make.tilemap({key: 'map', tileWidth: 50, tileHeight: 50});
    const tileset = map.addTilesetImage('colors');
    this.layer = map.createDynamicLayer(0, tileset, 0, 0);

    this.ship = new Ship(
      this,
      map.widthInPixels / 2 + 25,
      map.heightInPixels / 2 + 25
    );

    // the indicies for the different kinds of tiles
    this.tileValues = {
      regularTile: 0,
      borderTile: 2,
      harborTile: 1,
      pathTile: 3
    };

    // set function to run when a regular tile is collided with

    // make the ship not able to leave the world
    // for some reason adds weird borders in the middle of the map
    // this.ship.sprite.body.setCollideWorldBounds(true);

    // have the camera follow the sprite
    this.cameras.main.startFollow(this.ship.sprite);
    // make sure camera cant leave the world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    //  Checks to see if the player overlaps with a tile
    // ***not working on layer or tilemap
    this.physics.add.overlap(this.ship, this.layer, this.setPath, null, this);
  }
  update() {
    // the game loop which runs constantly
    this.ship.update();
  }
  setPath(ship, tile) {
    // lets assume we can do overlap with ship sprite and tilelayer
    // ******************Path Logic******************
    tile.index = this.tileValues.pathTile;

    console.log('arguments', arguments);
  }
}
