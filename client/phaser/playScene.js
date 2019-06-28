import clientStore from '../store';
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

    // the indicies for the different kinds of tiles
    this.tileValues = {
      regularTile: 0,
      borderTile: 2,
      harborTile: 1,
      // harborTile: 3,
      pathTile: 3
    };
  }

  create() {
    // adds objects to the game

    // adds objects to the game
    this.add.image(400, 300, 'colors');

    this.map = this.make.tilemap({key: 'map', tileWidth: 50, tileHeight: 50});
    const tileset = this.map.addTilesetImage('colors');
    // this.backgroundLayer = this.map.createStaticLayer(0, tileset, 0, 0);
    this.foregroundLayer = this.map.createDynamicLayer(0, tileset, 0, 0);

    console.group('test');
    console.log('this.foregroundLayer: ', this.foregroundLayer);
    console.log('map', this.map);
    console.groupEnd('test');

    this.ship = new Ship(
      this,
      this.map.widthInPixels / 2 + 25,
      this.map.heightInPixels / 2 + 25
    );

    // set function to run when a regular tile is collided with
    // this.backgroundLayer.setTileIndexCallback(
    //   this.tileValues.regularTile,
    //   this.setPath,
    //   this
    // );

    // make the ship not able to leave the world
    // for some reason adds weird borders in the middle of the map
    // this.ship.sprite.body.setCollideWorldBounds(true);

    // have the camera follow the sprite
    this.cameras.main.startFollow(this.ship.sprite);
    // make sure camera cant leave the world
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    //  Checks to see if the player overlaps with a tile
    // ***not working on layer or tilemap
    // this.physics.add.overlap(
    //   this.ship.sprite,
    //   this.harborLayer,
    //   // this.setPath,
    //   () => {
    //     console.log('overlapcallback called');
    //   },
    //   null,
    //   this
    // );
    // this.physics.add.overlapTiles(this.ship.sprite, )

    const {SHIFT} = Phaser.Input.Keyboard.KeyCodes;
    this.keys = this.input.keyboard.addKeys({
      shift: SHIFT
    });
  }

  update() {
    // the game loop which runs constantly
    this.ship.update();
    this.manuallyMakeHarbor();
  }
  setPath(ship, tile) {
    // lets assume we can do overlap with ship sprite and tilelayer
    // ******************Path Logic******************
    // tile.index = this.tileValues.pathTile;

    console.group();
    console.log('ship', ship);
    console.log('tile', tile);
    console.groupEnd();
  }

  manuallyMakeHarbor() {
    // draw harbor tiles with mouse
    const pointer = this.input.activePointer;
    if (pointer.isDown) {
      const worldPoint = pointer.positionToCamera(this.cameras.main);
      const pointerTileXY = this.map.worldToTileXY(worldPoint.x, worldPoint.y);
      const snappedWorldPoint = this.map.tileToWorldXY(
        pointerTileXY.x,
        pointerTileXY.y
      );

      if (this.keys.shift.isDown) {
        this.ship.floodFillArea(
          this.foregroundLayer.getTileAtWorldXY(
            snappedWorldPoint.x,
            snappedWorldPoint.y
          )
        );
      } else {
        this.foregroundLayer.putTileAtWorldXY(
          this.tileValues.harborTile,
          snappedWorldPoint.x,
          snappedWorldPoint.y
        );
      }
    }
  }
}
