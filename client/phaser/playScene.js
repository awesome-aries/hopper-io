import clientStore, {clientActionCreators} from '../store';
import Phaser from 'phaser';
import Ship from './ship';
import getTileIndices from '../util/getTileIndices';
import Opponent from './Opponent';
import socket from '../socket';
import {IndToXY} from '../util/tileMapConversions';

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

    // store the opponents
    // an array of objects with socketId and instance of Opponent class
    this.opponents = [];
  }
  init() {
    // used to prepare data
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
      game: {playerWorldXY, tileMap, pathIndex, harborIndex},
      opponent
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
    // ***************** Set up Opponents ***************
    this.createOpponents(opponent);
    // ***************** Set up Socket ******************

    // Set up our socket listener for updates from the server
    socket.on('updateState', (players, tileMapDiff) => {
      this.onUpdateState(players, tileMapDiff);
    });
    socket.on('wasKilled', () => {
      this.onWasKilled();
    });
    socket.on('newPlayer', player => this.onNewPlayer(player));

    // // when another player leaves the game or they are killed, we want to listen for the server to tell us that the player that left
    socket.on(
      'removePlayer',
      (removedPlayerID, newTileMap, newTileMapRowLength) =>
        this.onRemovedPlayer(removedPlayerID, newTileMap, newTileMapRowLength)
    );
    // **************************************************
  }
  onRemovedPlayer(removedPlayerID, newTileMapDiff) {
    // when a player leaves the game or killed we want to remove them from the game.
    clientStore.dispatch(
      clientActionCreators.opponent.removeOpponent(removedPlayerID)
    );

    //have to destroy sprite to remove from phaser
    this.opponents.forEach(phaserOpponent => {
      if (phaserOpponent.socketId === removedPlayerID) {
        phaserOpponent.opponent.destroy();
      }
    });
    //remove from our opponent list
    this.opponents = this.opponents.filter(phaserOpponent => {
      return phaserOpponent.socketId !== removedPlayerID;
    });
    console.log(`This is the player that left:`, removedPlayerID);

    // need to update our tile map
    this.updatePhaserTileMap(newTileMapDiff);

    // and in our store
    clientStore.dispatch(
      clientActionCreators.game.updateTileMap(newTileMapDiff)
    );
  }
  onNewPlayer(player) {
    // here we add the new player to our list
    clientStore.dispatch(clientActionCreators.opponent.addOpponent(player));
    this.makeOpponent(this, player.worldX, player.worldY);
    console.log('A new player has joined', player);
  }
  createOpponents(opponent) {
    //if the opponent from state doesn't exist in phaser opponents array, call makeOpponent to add it and create sprite.
    opponent.forEach(stateOpponent => {
      if (!this.opponents.includes(stateOpponent)) {
        //this creates the opponent sprite and adds it to this.opponents
        this.makeOpponent(
          this,
          opponent.worldX,
          opponent.worldY,
          opponent.direction
        );
      }
    });
  }

  update() {
    if (!this.alive) {
      this.gameOver();
    }
    // the game loop which runs constantly

    // get the state from the clientStore
    const {game} = clientStore.getState();

    this.ship.update(game);
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

  gameOver() {
    //this.ship.sprite.body.velocity.setTo(0, 0);
    console.log('game over loser');
    this.scene.start('losing');
  }

  createShip(playerWorldXY) {
    // creates the ship when the game first starts
    console.log('playerWorldXY', playerWorldXY);

    this.ship = new Ship(
      this,
      playerWorldXY.present.x,
      playerWorldXY.present.y
    );

    // make the ship not able to leave the world
    this.ship.sprite.body.setCollideWorldBounds(true);
  }

  createTileMap(tileMap) {
    // initialized the tilemap when the game first starts
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

    // set the tiles values according to the server

    tileMap.present.forEach((tileIndex, ind) => {
      let {x, y} = IndToXY(ind, this.planeDimensions.x);
      let tile = this.map.getTileAt(x, y);
      tile.index = tileIndex;
    });
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

  makeOpponent(x, y, direction, socketId) {
    // makes the opponent in phaser
    let newOpponnent = new Opponent(this, x, y, direction);

    // add the opponent to our list of opponents
    this.opponents.push({
      socketId,
      opponent: newOpponnent
    });
  }

  onUpdateState(players, tileMapDiff) {
    // when we get updates from the server we need to update the tilemap in phaser...
    console.log('from server tileMapDiff', tileMapDiff);

    this.updatePhaserTileMap(tileMapDiff);

    // and in our store
    clientStore.dispatch(clientActionCreators.game.updateTileMap(tileMapDiff));

    // also update opponents in state
    clientStore.dispatch(
      clientActionCreators.opponent.updateOpponentsPos(players)
    );

    // and phaser
    this.updateOpponents();
  }
  updateOpponents() {
    // update the phaser opponent sprites based on the opponent in store's position
    const {opponent} = clientStore.getState();
    opponent.forEach(stateOpponent => {
      this.opponents.forEach(phaserOpponent => {
        if (stateOpponent.socketId === phaserOpponent.socketId) {
          phaserOpponent.opponent.move(
            stateOpponent.worldX,
            stateOpponent.worldY,
            stateOpponent.direction
          );
        }
      });
    });
  }
  updatePhaserTileMap(tileMapDiff) {
    // set the tiles in phaser to match the store
    tileMapDiff.forEach(({tileInd, tileIndex}) => {
      let {x, y} = IndToXY(tileInd, this.planeDimensions.x);
      let tile = this.map.getTileAt(x, y);
      tile.index = tileIndex;
    });
    // not sure if it'll take a flat array
    // this.foregroundLayer.putTilesAt(tileMap.present, 0, 0);
  }
  onWasKilled() {
    console.log('You were killed');
    // here we need to set on the gameState that they were killed
    this.alive = false;

    // dont set isPlaying to false yet because that will immediately transition them out of the game, set it in the losing screen
  }
}
