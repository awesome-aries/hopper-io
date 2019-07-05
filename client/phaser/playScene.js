import clientStore, {clientActionCreators} from '../store';
import Phaser from 'phaser';
import Ship from './ship';
import getTileIndices from '../util/getTileIndices';
import Opponent from './Opponent';
import socket from '../socket';

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

    this.alive = true;

    // this.shipSpawnX =

    // store the opponents
    // an array of objects with socketId and instance of Opponent class
    this.opponents = [];
  }
  init() {
    // used to prepare data
    // get the tilemap array data and send it to our clientStore
    // now dont set the tile map in store here, since its being set in the onStart listener with the tilemap from the server
    // clientStore.dispatch(
    //   clientActionCreators.game.setTilemap(
    //     TileMapJS.layers[0].data,
    //     TileMapJS.layers[0].width
    //   )
    // );
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

  create() {
    // adds objects to the game

    // get the current state from store
    // get the players location from store that was sent from the server
    const {
      game: {playerWorldXY, tileMap, pathIndex, harborIndex}
    } = clientStore.getState();

    // the indicies for the different kinds of tiles
    this.tileValues = getTileIndices();

    // the specific values for this player
    this.harborIndex = harborIndex;
    this.pathIndex = pathIndex;

    // **************** Set up the tilemap **************

    this.createTileMap(tileMap);

    // **************************************************

    // **************** Set up the Ship **************

    this.createShip(playerWorldXY);

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

    // **************************************************

    // ************* Set up the Input Cntrls ***********

    const {SHIFT} = Phaser.Input.Keyboard.KeyCodes;
    this.keys = this.input.keyboard.addKeys({
      shift: SHIFT
    });
    // **************************************************

    // ***************** Set up Socket ******************

    // Set up our socket listener for updates from the server
    socket.on('updateState', (players, newTileMap, newTileMapRowLength) => {
      this.onUpdateState(players, newTileMap, newTileMapRowLength);
    });
    // **************************************************
  }

  update() {
    // the game loop which runs constantly

    // get the state from the clientStore
    const {game} = clientStore.getState();

    this.ship.update(game);

    if (!this.alive) {
      this.gameOver();
    }
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

  gameOver() {
    //this.ship.sprite.body.velocity.setTo(0, 0);
    console.log('game over loser');
    this.scene.start('losing');
    // introText.text = 'Game Over!';
    // introText.visible = true;
  }

  createShip(playerWorldXY) {
    console.log('playerWorldXY', playerWorldXY);

    this.ship = new Ship(
      this,
      playerWorldXY.present.x,
      playerWorldXY.present.y
    );

    // const {x, y} = this.randomizeXY(
    //   this.map.widthInPixels,
    //   this.map.heightInPixels,
    //   this.map.tileWidth,
    //   this.map.tileHeight
    // );

    // this.ship = new Ship(
    //   this,
    //   x + this.map.tileWidth / 2,
    //   y + this.map.tileHeight / 2
    // );

    // make the ship not able to leave the world
    this.ship.sprite.body.setCollideWorldBounds(true);
  }

  createTileMap(tileMap) {
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

    // set the tiles in phaser to match the store
    // tileMap.present.forEach((tileIndex, ind) => {
    //   let { x, y} = IndToXY(ind);

    // })
    // not sure if it'll take a flat array
    this.foregroundLayer.putTilesAt(tileMap.present, 0, 0);
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
      } else if (clickedTile.index !== this.harborIndex) {
        this.setTileIndex(this.harborIndex, {
          type: 'world', //must indicate format of xy
          x: snappedWorldPoint.x,
          y: snappedWorldPoint.y
        });
      }
    }
  }

  makeOpponent(x, y, direction) {
    // TODO this is not implemented anywhere yet
    let newOpponnent = new Opponent(this, x, y, direction);

    // add the opponent to our list of opponents
    this.opponents.push({
      socketId: '',
      opponent: newOpponnent
    });
  }
  // this is called in our listeners file whenever
  onUpdateState(players, newTileMap, newTileMapRowLength) {
    // when we get updates from the server we need to update the tilemap in phaser...
    this.foregroundLayer.putTilesAt(newTileMap, 0, 0);
    // and in our store
    clientStore.dispatch(
      clientActionCreators.game.setTilemap(newTileMap, newTileMapRowLength)
    );

    // also update opponents
    // TODO
  }
}
