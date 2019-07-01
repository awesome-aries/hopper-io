/* eslint-disable complexity */
import Phaser from 'phaser';
import clientStore, {clientActionCreators} from '../store';

export default class Ship {
  constructor(scene, x, y) {
    this.scene = scene;
    this.absVelocity = 200;
    this.direction = 1; //positive is down and right, negative is up and left
    this.didTurn = false; // we have to know if we turned or not
    this.facingDir = 'north'; //keep track of direction we're facing
    // we need to keep track of the all the verticies of the drawn polygon
    // aka every place we turn and the entry and exit, we'll store them here.
    this.vertices = [];

    // ********* Set the Ship's starting location *********

    let tileXY = this.scene.map.worldToTileXY(x, y);

    this.sprite = scene.physics.add
      .sprite(x, y, 'ship', 0)
      // .setDrag(1000, 0)
      .setSize(50, 50)
      .setOffset(0, 0);

    this.sprite.body.setAllowGravity(false);
    // ** doesnt seem to do anything T_T
    // this.sprite.body.collideWorldBounds = true;
    const startPos = this.scene.foregroundLayer.getTileAtWorldXY(x, y);
    const harbor = this.getSurroundingTiles(startPos);

    harbor.forEach(tile => {
      this.scene.setTileIndex(this.scene.tileValues.harborTile, {
        x: tile.x,
        y: tile.y,
        type: 'tile'
      });
    });

    clientStore.dispatch(
      clientActionCreators.game.setPlayerXY(tileXY.x, tileXY.y, this.facingDir)
    );

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
    this.sprite.body.moves = !this.sprite.body.moves;
  }

  update(game) {
    const {keys, sprite} = this;

    // ******************Movement Logic******************
    if (keys.left.isDown) {
      this.direction = -1;
      sprite.body.setVelocity(this.absVelocity * this.direction, 0);
      sprite.anims.play('ship-west');
      this.facingDir = 'west';
    } else if (keys.up.isDown) {
      this.direction = -1;
      sprite.body.setVelocity(0, this.absVelocity * this.direction);
      sprite.anims.play('ship-north');
      this.facingDir = 'north';
    } else if (keys.right.isDown) {
      this.direction = 1;
      sprite.body.setVelocity(this.absVelocity * this.direction, 0);
      sprite.anims.play('ship-east');
      this.facingDir = 'east';
    } else if (keys.down.isDown) {
      this.direction = 1;
      sprite.body.setVelocity(0, this.absVelocity * this.direction);
      sprite.anims.play('ship-south');
      this.facingDir = 'south';
    } else if (keys.space.isDown) {
      // for testing purposes
      this.freeze();
    }

    // // ******************Path Logic******************
    // // get the tile at the location of the ship

    this.setPath(game);

    // *************************************************
  }

  // eslint-disable-next-line complexity
  setPath(game) {
    // get the current state of the store from playScene update
    // ******************Path Logic******************

    const {
      playerPhaserXY,
      currentTileIdx,
      entryPoint,
      exitPoint,
      direction
    } = game;

    let currTileXY = `${playerPhaserXY.present.x},${playerPhaserXY.present.y}`;

    let newTile = this.scene.foregroundLayer.getTileAtWorldXY(
      this.sprite.x,
      this.sprite.y
    );
    let newTileXY = `${newTile.x},${newTile.y}`;

    // check to see if the cart has moved to a new tile or not.
    if (newTileXY !== currTileXY) {
      // If we've reached a new tile, then set that as the new present tile
      clientStore.dispatch(
        clientActionCreators.game.movePlayer(
          newTile.x,
          newTile.y,
          this.facingDir
        )
      );

      //check to see if the ship has changed directions and if so save tile in our list of vertices
      if (direction.previous !== direction.present) {
        this.vertices.push([
          playerPhaserXY.previous.x,
          playerPhaserXY.previous.y
        ]);
      }

      // If the user is moving from harbor to a different kind of tile, then we must set the exit point
      if (
        currentTileIdx.previous === this.scene.tileValues.harborTile &&
        currentTileIdx.present !== this.scene.tileValues.harborTile
      ) {
        clientStore.dispatch(
          clientActionCreators.game.setExitPoint(
            playerPhaserXY.present.x,
            playerPhaserXY.present.y
          )
        );
        //save the exit point in our vertices
        this.vertices.push([
          playerPhaserXY.present.x,
          playerPhaserXY.present.y
        ]);
      } else if (
        currentTileIdx.previous !== this.scene.tileValues.harborTile &&
        currentTileIdx.present === this.scene.tileValues.harborTile
      ) {
        // If the user is moving from sea to harbor, then we must set the entry point

        clientStore.dispatch(
          clientActionCreators.game.setEntryPoint(
            playerPhaserXY.present.x,
            playerPhaserXY.present.y
          )
        );
        //save the entry point in our vertices
        this.vertices.push([
          playerPhaserXY.present.x,
          playerPhaserXY.present.y
        ]);
      }

      if (entryPoint && exitPoint) {
        // when both have been set then we want to clear them and call the findFillPoint method
        this.findFillPoint(
          this.vertices[0],
          this.vertices[this.vertices.length - 1]
        );

        clientStore.dispatch(clientActionCreators.game.clearExitEntry());
      }

      // get the tile at the location of the ship and make it a path tile if on a regular tile
      if (currentTileIdx.present === this.scene.tileValues.regularTile) {
        this.scene.setTileIndex(
          this.scene.tileValues.pathTile, //type of tile to set it to
          {
            type: 'tile', //must indicate format of xy
            x: playerPhaserXY.present.x,
            y: playerPhaserXY.present.y
          }
        );
      }
    }
  }

  findFillPoint() {
    // This will take the point at which the ship exited the harbor, get all the surrounding squares, and loop through until it finds one that is enclosed in the path and select that as the fillPoint.

    let potentialFillPoints = [];
    for (let j = 0; j < this.vertices.length; j++) {
      const vertex = this.vertices[j];
      let vertexTile = this.scene.foregroundLayer.getTileAt(
        vertex[0],
        vertex[1]
      );
      potentialFillPoints = potentialFillPoints.concat(
        this.getSurroundingTiles(vertexTile, true)
      );
      for (let i = 0; i < potentialFillPoints.length; i++) {
        // once we find a point inside the path we can stop.
        if (this.insidePoly(potentialFillPoints[i], this.vertices)) {
          let fillPoint = potentialFillPoints[i];
          this.floodFillArea(fillPoint);
          return;
        }
      }
    }
    let minX = Infinity;
    let minY = Infinity;
    let maxX = 0;
    let maxY = 0;
    this.vertices.forEach(el => {
      if (el[0] < minX) {
        minX = el[0];
      } else if (el[0] > maxX) {
        maxX = el[0];
      }
      if (el[1] < minY) {
        minY = el[1];
      } else if (el[1] > maxY) {
        maxY = el[1];
      }
    });
    // here we want to fill all the path tiles instead
    // track maxX minX, maxY, minY
    this.scene.foregroundLayer.replaceByIndex(
      this.scene.tileValues.pathTile,
      this.scene.tileValues.harborTile,
      minX,
      minY,
      maxX - minX + 1,
      maxY - minY + 1
    );
    this.vertices = [];
  }

  insidePoly(point, corners) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    let x = point.x,
      y = point.y;

    let inside = false;
    for (let i = 0, j = corners.length - 1; i < corners.length; j = i++) {
      let xi = corners[i][0],
        yi = corners[i][1];
      let xj = corners[j][0],
        yj = corners[j][1];

      let intersect =
        yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  }

  floodFillArea(startTile) {
    // startTile is a phaser tile object
    //Fill an area enclosed by path (including the tiles in the path itself)
    //stack of tiles to examine
    let toExplore = [];
    toExplore.push(startTile);
    let currentTile;
    while (toExplore.length > 0) {
      //look at next tile in the stack and the surrounding tiles
      currentTile = toExplore.shift();
      let neighbors = this.getSurroundingTiles(currentTile);
      toExplore = toExplore.concat(neighbors);
      // whether the tile is part of the path, or not fill it and make it part of the harbor
      this.scene.setTileIndex(this.scene.tileValues.harborTile, {
        x: currentTile.x,
        y: currentTile.y,
        type: 'tile'
      });
    }
  }

  getSurroundingTiles(currTile, findingFillPoint = false) {
    // this takes a phase tile object
    //get range of the surrounding square coordinates
    // if the value of the tile is 0 then get all
    // but if the value is a path tile, then we only want to grab
    // surrounding squares that are also path tiles

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
    let tiles = [];

    for (let i = xmin; i <= xmax; i++) {
      for (let j = ymin; j <= ymax; j++) {
        let neighborTile = this.scene.foregroundLayer.getTileAt(i, j);
        if (
          findingFillPoint &&
          neighborTile.index === this.scene.tileValues.regularTile
        ) {
          tiles.push(neighborTile);
        } else if (
          !findingFillPoint &&
          (currTile.index === this.scene.tileValues.regularTile ||
            (currTile.index === this.scene.tileValues.pathTile &&
              neighborTile.index === this.scene.tileValues.pathTile))
        ) {
          // if we're floodfilling, use separate logic
          tiles.push(neighborTile);
        }
      }
    }
    return tiles;
  }
}
