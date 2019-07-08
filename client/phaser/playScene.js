import clientStore, {clientActionCreators} from '../store';
import Phaser from 'phaser';
import Ship from './ship';
import getTileIndices from '../util/getTileIndices';
import Opponent from './Opponent';
import socket from '../socket';
import {IndToXY} from '../util/tileMapConversions';
import {playerKilled} from '../socket/emitEvents';

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

    //here the opponents will live as opponent objects so we can move them in update opponents(called from onUpdateState)
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

    // ***************** Set up Score *****************

    // this.createScore(playerWorldXY, score, playerName);
    this.ship.calculateScore(tileMap);

    // **************************************************
    // ***************** Set up Opponents ***************

    this.createOpponents(opponent);

    // ***************** Set up Socket ******************

    // Set up our socket listener for updates from the server
    socket.on('updateState', this.onUpdateState);
    socket.on('wasKilled', this.onWasKilled);
    socket.on('newPlayer', this.onNewPlayer);

    // when another player leaves the game or they are killed, we want to listen for the server to tell us that the player that left
    socket.on('removePlayer', this.onRemovePlayer);
    // **************************************************
  }
  update() {
    // the game loop which runs constantly

    // get the state from the clientStore
    const {game} = clientStore.getState();

    this.ship.update(game);

    // this.manuallyMakeHarbor();
  }

  onRemovePlayer = (removedPlayerID, newTileMapDiff) => {
    // need to update our tile map
    this.updatePhaserTileMap(newTileMapDiff);

    // and in our store
    clientStore.dispatch(
      clientActionCreators.game.updateTileMap(newTileMapDiff)
    );

    //******** need someway of removing player when they die from this.opponents so they player object doesn't keep moving
    //this.opponents.filter
    let removedOpponent = this.opponents.getChildren().find(phaserOpponent => {
      return phaserOpponent.socketId === removedPlayerID;
    });
    // get rid of that opponent
    removedOpponent.destroy();

    // when a player leaves the game or killed we want to remove them from the game.
    clientStore.dispatch(
      clientActionCreators.opponent.removeOpponent(removedPlayerID)
    );
    let opponents = clientStore.getState().opponent;
    console.log(
      `This is the player that left:`,
      removedPlayerID,
      `opponents: `,
      opponents
    );
  };

  onNewPlayer = player => {
    // here we add the new opponent to our store if you are currently playing
    clientStore.dispatch(clientActionCreators.opponent.addOpponent(player));

    this.makeOpponent(player.worldX, player.worldY, 'north', player.socketId);

    console.log('A new player has joined', player);
  };
  createOpponents(opponent) {
    // this.opponents = [];
    //here we are creating the opponents if you are joining a pre-existing game
    console.log('opponent', opponent);
    //if the opponent from state doesn't exist in phaser opponents array, call makeOpponent to add it and create sprite.
    this.opponents = this.add.group();

    opponent.forEach(stateOpponent => {
      this.makeOpponent(
        stateOpponent.worldX,
        stateOpponent.worldY,
        stateOpponent.direction,
        stateOpponent.socketId
      );
    });
    // add collision and call back which calls game over with ship
    this.physics.add.collider(this.ship, this.opponents);
    this.physics.add.overlap(
      this.ship,
      this.opponents,
      this.playersCollided,
      null,
      this
    );
  }

  makeOpponent(x, y, direction, socketId) {
    // makes the opponent in phaser

    let newOpponnent = new Opponent(this, x, y, direction, socketId);
    // its the sprite that must be added to the group
    this.opponents.add(newOpponnent.sprite);
  }

  updateOpponents() {
    // update the phaser opponent sprites based on the opponent in store's position
    const {opponent} = clientStore.getState();
    console.log('opponents on local', this.opponents.getChildren());

    // go through all the opponents in the opponent group
    this.opponents.getChildren().forEach(phaserOpponent => {
      // go through the opponents in store
      for (let i = 0; i < opponent.length; i++) {
        const stateOpponent = opponent[i];
        console.log('phaserOpponent', phaserOpponent);
        // and find its match and update the position
        if (phaserOpponent.socketId === stateOpponent.socketId) {
          // phaserOpponent.move(
          //   stateOpponent.worldX,
          //   stateOpponent.worldY,
          //   stateOpponent.direction
          // );
          // phaserOpponent.setPosition(
          //   stateOpponent.worldX,
          //   stateOpponent.worldY
          // );
          // still not updating***
          phaserOpponent.x = stateOpponent.worldX;
          phaserOpponent.y = stateOpponent.worldY;
          phaserOpponent.direction = stateOpponent.direction;
          // once we've found the correct opponent in state no need to keep checking
          break;
        }
      }
    });
  }
  playersCollided(ship, opponent) {
    // when a player and an opponent collide they should both die
    console.log('You collided and died');

    // need to emit an event to the server that this player has been killed, this will trigger the server to send the player back the wasKilled event
    playerKilled(this.pathIndex);
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

    // when we are killed we no longer want to listen to socket events
    socket.removeListener('updateState', this.onUpdateState);
    socket.removeListener('wasKilled', this.onWasKilled);
    socket.removeListener('newPlayer', this.onNewPlayer);
    socket.removeListener('removePlayer', this.onRemovePlayer);

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

  createScore(playerWorldXY, score, playerName) {
    //keeping track of score
    this.score = score;

    this.scoreText = this.add.text(
      playerWorldXY.present.x + 240,
      playerWorldXY.present.y - 300,
      `${playerName} : ${this.score}`,
      {
        font: '34px Arial',
        fill: 'black'
      }
    );
    console.log('score text,', this.scoreText);
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

  onUpdateState = (players, tileMapDiff) => {
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
  };

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

  onWasKilled = () => {
    console.log('You were killed');
    // stop the game timer
    clientStore.dispatch(clientActionCreators.gameState.gameOver());
    this.gameOver();

    // dont set isPlaying to false yet because that will immediately transition them out of the game, set it in the losing screen
  };
}
