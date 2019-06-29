import clientStore, {clientActionTypes} from '../store';
import Phaser from 'phaser';
import Ship from './ship';
import TileMapJS from '../../public/assets/testtilemap';

export default class PlayScene extends Phaser.Scene {
  constructor() {
    // passing 'play' as a parameter that will serve as the identifier for this scene
    super('play');

    this.TILE_MAP_PATH = 'assets/testtilemap.csv';
    this.TILE_SET_PATH = 'assets/test-tile-set50x50tiles.png';
    this.SHIP_SPRITE_PATH = 'assets/shipspritealpha.png';

    this.TILE_SET_NAME = 'colors';

    this.tileWidth = 50;
    this.tileHeight = 50;

    this.tileMapRow = 50;
    this.tileMapHeight = 50;

    // the indicies for the different kinds of tiles
    this.tileValues = {
      regularTile: 0,
      borderTile: 2,
      harborTile: 1,
      // harborTile: 3,
      pathTile: 3
    };

    // this.shipSpawnX =
  }
  init() {
    // used to prepare data

    // get the tilemap array data and send it to our clientStore
    clientStore.dispatch({
      type: clientActionTypes.tiles.SET_TILEMAP,
      tileMap: TileMapJS.layers[0].data,
      tileMapRowLength: this.tileMapRow
    });
  }
  preload() {
    // loading in data

    this.load.spritesheet('ship', this.SHIP_SPRITE_PATH, {
      frameWidth: 49,
      frameHeight: 50
    });

    this.load.tilemapCSV('map', this.TILE_MAP_PATH);
    this.load.image(this.TILE_SET_NAME, this.TILE_SET_PATH);
  }

  create() {
    // adds objects to the game

    // **************** Set up the tilemap **************

    this.map = this.make.tilemap({
      key: 'map',
      tileWidth: this.tileWidth,
      tileHeight: 50
    });
    const tileset = this.map.addTilesetImage(this.TILE_SET_NAME);

    // might want to set up a static background layer
    // this.backgroundLayer = this.map.createStaticLayer(0, tileset, 0, 0);
    this.foregroundLayer = this.map.createDynamicLayer(0, tileset, 0, 0);

    // **************************************************

    // **************** Set up the Ship **************

    this.ship = new Ship(
      this,
      this.map.widthInPixels / 2 + this.tileWidth / 2,
      this.map.heightInPixels / 2 + this.tileHeight / 2
      // this.map.widthInPixels / 2 + 25,
      // this.map.heightInPixels / 2 + 25
    );

    // make the ship not able to leave the world
    // for some reason adds weird borders in the middle of the map
    // this.ship.sprite.body.setCollideWorldBounds(true);

    // **************************************************

    // **************** Set up the Camera **************

    // have the camera follow the sprite
    this.cameras.main.startFollow(this.ship.sprite);
    // make sure camera cant leave the world
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    // **************************************************

    // ************* Set up the Input Cntrls ***********

    const {SHIFT} = Phaser.Input.Keyboard.KeyCodes;
    this.keys = this.input.keyboard.addKeys({
      shift: SHIFT
    });
    // **************************************************
  }

  update() {
    // the game loop which runs constantly

    // get the state from the clientStore
    const {tiles, players} = clientStore.getState();

    this.ship.update(tiles, players);
    this.manuallyMakeHarbor();
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
