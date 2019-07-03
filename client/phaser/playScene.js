import clientStore, {clientActionCreators} from '../store';
import Phaser from 'phaser';
import Ship from './ship';
import * as TileMapJS from '../../public/assets/hopperio-tilemap.json';
import getTileIndices from '../../util/getTileIndices';
import Opponent from './Opponent';

export default class PlayScene extends Phaser.Scene {
  constructor() {
    // passing 'play' as a parameter that will serve as the identifier for this scene
    super('play');

    this.TILE_MAP_PATH = 'assets/hopperio-tilemap.json';
    this.TILE_SET_PATH = 'assets/tile-set50x50tiles.png';
    this.SHIP_SPRITE_PATH = 'assets/shipspritealpha.png';

    this.TILE_SET_NAME = '8colors50x50Tileset';

    this.tileWidth = 50;
    this.tileHeight = 50;

    // the indicies for the different kinds of tiles
    this.tileValues = getTileIndices();

    // this.shipSpawnX =

    // store the opponents
    // an array of objects with socketId and instance of Opponent class
    this.opponents = [];
  }
  init() {
    // used to prepare data

    // get the tilemap array data and send it to our clientStore
    clientStore.dispatch(
      clientActionCreators.game.setTilemap(
        TileMapJS.layers[0].data,
        TileMapJS.layers[0].width
      )
    );
  }
  preload() {
    // loading in data

    this.load.spritesheet('ship', this.SHIP_SPRITE_PATH, {
      frameWidth: 49,
      frameHeight: 50
    });

    this.load.tilemapTiledJSON('map', this.TILE_MAP_PATH);
    this.load.image(this.TILE_SET_NAME, this.TILE_SET_PATH);
  }

  randomizeXY(mapWidth, mapHeight, tileWidth, tileHeight) {
    const maxX = mapWidth / tileWidth;
    const maxY = mapHeight / tileHeight;
    let startPosition = {};
    //5 represents 3 as the min, so that the ship always spawns 3 tiles from the min border
    //and 2 so that the ship always spawns 3 away from the max (its exclusive so its really -3 + 1)
    //if we ever want to change the harbor size(right now were assuming 3x3) we would change these values!
    startPosition.x = Math.floor(Math.random() * (maxX - 5) + 3) * tileWidth;
    startPosition.y = Math.floor(Math.random() * (maxY - 5) + 3) * tileHeight;
    return startPosition;
  }

  create() {
    // adds objects to the game

    // **************** Set up the tilemap **************

    this.map = this.make.tilemap({
      key: 'map',
      tileWidth: this.tileWidth,
      tileHeight: this.tileHeight
    });
    const tileset = this.map.addTilesetImage(this.TILE_SET_NAME);

    // might want to set up a static background layer
    // this.backgroundLayer = this.map.createStaticLayer(0, tileset, 0, 0);
    this.foregroundLayer = this.map.createDynamicLayer(0, tileset, 0, 0);

    this.planeDimensions = this.map.worldToTileXY(
      this.foregroundLayer.width,
      this.foregroundLayer.height
    );

    // **************************************************

    // **************** Set up the Ship **************

    const {x, y} = this.randomizeXY(
      this.map.widthInPixels,
      this.map.heightInPixels,
      this.map.tileWidth,
      this.map.tileHeight
    );

    this.ship = new Ship(
      this,
      x + this.map.tileWidth / 2,
      y + this.map.tileHeight / 2
    );

    // make the ship not able to leave the world
    // for some reason adds weird borders in the middle of the map
    this.ship.sprite.body.setCollideWorldBounds(true);

    // **************************************************

    // **************** Set up the Camera **************

    // have the camera follow the sprite
    this.cameras.main.startFollow(this.ship.sprite);
    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    // make sure camera cant leave the world
    // this.cameras.main.setBounds(
    //   0,
    //   0,
    //   this.map.widthInPixels,
    //   this.map.heightInPixels
    // );

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
    const {game} = clientStore.getState();

    this.ship.update(game);
    // this.manuallyMakeHarbor();
  }

  setTileIndex(tileIndex, location) {
    // Sets the tile type in phaser and redux using world (pixel) coordinates

    // location argument holds data about what type of coordinates are being passed in
    // { type: 'world'/'tile', x, y }
    // type indicates what format x and y are in, world means x and y are in pixels and tile means they are according to the tileMap coords
    let newTile;

    // get the tile
    if (location.type === 'world') {
      newTile = this.foregroundLayer.getTileAtWorldXY(location.x, location.y);
    } else {
      newTile = this.map.getTileAt(location.x, location.y);
    }

    // if it's a different type
    if (newTile.index !== tileIndex) {
      // set the tile in phaser
      newTile.index = tileIndex;
      // also change the tile in the store
      clientStore.dispatch(
        clientActionCreators.game.setTile(newTile.x, newTile.y, tileIndex)
      );
    }
  }

  getOpponents() {
    // get all the opponents in the game when the user starts the game
  }

  clearPlayerTiles(playerIndex) {
    // clear a players harbor and path tiles when the die or they disconnect from the game
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

      let clickedTile = this.foregroundLayer.getTileAtWorldXY(
        snappedWorldPoint.x,
        snappedWorldPoint.y
      );
      console.log('clicked tile', clickedTile);

      if (this.keys.shift.isDown) {
        this.ship.fillArea(clickedTile);
      } else if (clickedTile.index !== this.tileValues.harbor) {
        this.setTileIndex(this.tileValues.harbor, {
          type: 'world', //must indicate format of xy
          x: snappedWorldPoint.x,
          y: snappedWorldPoint.y
        });
      }
    }
  }

  makeOpponent(x, y, direction) {
    let newOpponnent = new Opponent(this, x, y, direction);

    // add the opponent to our list of opponents
    this.opponents.push({
      socketId: '',
      opponent: newOpponnent
    });
  }
}
