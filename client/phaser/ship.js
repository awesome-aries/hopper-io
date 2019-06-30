import Phaser from 'phaser';
import clientStore, {clientActionTypes} from '../store';

export default class Ship {
  constructor(scene, x, y) {
    this.scene = scene;
    this.absVelocity = 30;
    this.direction = 1; //positive is down and right, negative is up and left

    // ********* Set the Ship's starting location *********

    let tileXY = this.scene.map.worldToTileXY(x, y);

    clientStore.dispatch({
      type: clientActionTypes.game.SET_PLAYER_XY,
      x: tileXY.x,
      y: tileXY.y
    });

    this.sprite = scene.physics.add
      .sprite(x, y, 'ship', 0)
      // .setDrag(1000, 0)
      .setSize(50, 50)
      .setOffset(0, 0);

    this.sprite.body.setAllowGravity(false);
    // ** doesnt seem to do anything T_T
    // this.sprite.body.collideWorldBounds = true;

    // **************************************
    // create animation
    const anims = scene.anims;
    anims.create({
      key: 'ship-north',
      frames: [{key: 'ship', frame: 0}],
      frameRate: 3,
      repeat: -1
    });

    anims.create({
      key: 'ship-east',
      frames: [{key: 'ship', frame: 1}],
      frameRate: 3,
      repeat: -1
    });
    anims.create({
      key: 'ship-south',
      frames: [{key: 'ship', frame: 2}],
      frameRate: 3,
      repeat: -1
    });
    anims.create({
      key: 'ship-west',
      frames: [{key: 'ship', frame: 3}],
      frameRate: 3,
      repeat: -1
    });

    const {LEFT, RIGHT, UP, DOWN, SPACE} = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      down: DOWN,
      space: SPACE
    });
  }
  freeze() {
    this.sprite.body.moves = false;
  }

  update() {
    const {keys, sprite} = this;

    // ******************Movement Logic******************
    if (keys.left.isDown) {
      this.direction = -1;
      sprite.body.setVelocity(this.absVelocity * this.direction, 0);
      sprite.anims.play('ship-west');
    } else if (keys.up.isDown) {
      this.direction = -1;
      sprite.body.setVelocity(0, this.absVelocity * this.direction);
      sprite.anims.play('ship-north');
    } else if (keys.right.isDown) {
      this.direction = 1;
      sprite.body.setVelocity(this.absVelocity * this.direction, 0);
      sprite.anims.play('ship-east');
    } else if (keys.down.isDown) {
      this.direction = 1;
      sprite.body.setVelocity(0, this.absVelocity * this.direction);
      sprite.anims.play('ship-south');
    } else if (keys.space.isDown) {
      // for testing purposes
      this.freeze();
    }

    // // ******************Path Logic******************
    // // get the tile at the location of the ship
    // let tile = this.scene.layer.putTileAtWorldXY(
    //   this.scene.tileValues.pathTile,
    //   this.sprite.x,
    //   this.sprite.y
    // );
    this.setPath();

    // *************************************************
  }

  // eslint-disable-next-line complexity
  setPath() {
    // ******************Path Logic******************

    // get the current state of the store
    const {
      game: {playerXY, currentTileIdx, entryPoint, exitPoint}
    } = clientStore.getState();

    let currTileXY = `${playerXY.present.x},${playerXY.present.y}`;

    let newTile = this.scene.foregroundLayer.getTileAtWorldXY(
      this.sprite.x,
      this.sprite.y
    );
    let newTileXY = `${newTile.x},${newTile.y}`;

    // check to see if the cart has moved to a new tile or not.
    if (newTileXY !== currTileXY) {
      // If we've reached a new tile, then set that as the new present tile
      clientStore.dispatch({
        type: clientActionTypes.game.MOVE_PLAYER,
        x: newTile.x,
        y: newTile.y
      });

      console.group('tileValues');
      console.log('currTileXY', currTileXY);
      console.log('newTileXY', newTileXY);
      console.log('previousTileIdx', currentTileIdx.previous);
      console.log('presentTileIdx', currentTileIdx.present);
      console.groupEnd('tileValues');
      // If the user is moving from harbor to sea, then we must set the exit point
      if (
        currentTileIdx.previous === this.scene.tileValues.harborTile &&
        currentTileIdx.present === this.scene.tileValues.regularTile
      ) {
        clientStore.dispatch({
          type: clientActionTypes.game.SET_EXIT_POINT,
          x: newTile.x,
          y: newTile.y
        });
      } else if (
        currentTileIdx.previous === this.scene.tileValues.pathTile &&
        currentTileIdx.present === this.scene.tileValues.harborTile
      ) {
        // If the user is moving from sea to harbor, then we must set the entry point
        clientStore.dispatch({
          type: clientActionTypes.game.SET_ENTRY_POINT,
          x: newTile.x,
          y: newTile.y
        });
      }

      if (entryPoint && exitPoint) {
        console.log('set both!! exit:', exitPoint, 'entry', entryPoint);
        // when both have been set then we want to clear them and call the findFillPoint method
        this.findFillPoint(exitPoint, entryPoint);
        clientStore.dispatch({
          type: clientActionTypes.game.CLEAR_EXIT_ENTRY
        });
        this.freeze();
      }

      // get the tile at the location of the ship and make it a path tile if on a regular tile
      if (currentTileIdx.present === this.scene.tileValues.regularTile) {
        this.scene.setTileIndex(
          this.scene.tileValues.pathTile, //type of tile to set it to
          {
            type: 'tile', //must indicate format of xy
            x: playerXY.present.x,
            y: playerXY.present.y
          }
        );
      }
    }
  }
  findFillPoint(exitPoint, entryPoint) {
    console.log('in the findFillPoint method', exitPoint, entryPoint);
    let fillPoint;
    // this.floodFillArea(fillPoint);
  }
  floodFillArea(startTile) {
    // startTile is a phaser tile object
    //Fill an area enclosed by path (including the tiles in the path itself)
    //stack of tiles to examine
    console.group('floodFill');
    console.log('in floodFill, startTile', startTile);

    let toExplore = [startTile];
    let currentTile;
    while (toExplore.length > 0) {
      //look at next tile in the stack and the surrounding tiles
      console.log('toExplore', toExplore);
      currentTile = toExplore.shift();
      console.log('currentTile', currentTile);
      let neighbors = this.getSurroundingTiles(currentTile);
      toExplore = toExplore.concat(neighbors);
      console.log('adding neighbors!');
      console.log('toExplore', toExplore);
      // whether the tile is part of the path, or not fill it and make it part of the harbor
      currentTile.index = this.scene.tileValues.borderTile;
    }
    console.log('floodFIll end!!');
    console.groupEnd('floodFill');
  }
  getSurroundingTiles(currTile) {
    // this takes a phase tile object
    //get range of the surrounding square coordinates
    // if the value of the tile is 0 then get all
    // but if the value is a path tile, then we only want to grab
    // surrounding squares that are also path tiles
    console.group('getNeighbors');

    let xmin = currTile.x - 1 < 0 ? 0 : currTile.x - 1;
    let ymin = currTile.y - 1 < 0 ? 0 : currTile.y - 1;

    // get the max possible values of the plane
    let planeDimensions = this.scene.map.worldToTileXY(
      this.scene.foregroundLayer.width,
      this.scene.foregroundLayer.height
    );

    let xmax =
      currTile.x + 1 >= planeDimensions.x
        ? planeDimensions.x - 1
        : currTile.x + 1;
    let ymax =
      currTile.y + 1 >= planeDimensions.y
        ? planeDimensions.y - 1
        : currTile.y + 1;

    let range = {xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax};
    console.log('range', range);
    let tiles = [];

    for (let i = xmin; i <= xmax; i++) {
      for (let j = ymin; j <= ymax; j++) {
        let neighborTile = this.scene.foregroundLayer.getTileAtXY(i, j);
        console.log('neighborTile', neighborTile);
        if (
          neighborTile.index === this.scene.tileValues.regularTile ||
          (currTile.index === this.scene.tileValues.pathTile &&
            neighborTile.index === this.scene.tileValues.pathTile)
        ) {
          tiles.push(neighborTile);
        }
      }
    }
    console.log('returning tiles', tiles);
    console.groupEnd('getNeighbors');
    return tiles;
  }
}
