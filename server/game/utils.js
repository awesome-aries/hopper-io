// get the map width and height from the tilemap
const tileMap = require('../../public/assets/hopperio-tilemap.json');

let [tileset] = tileMap.tilesets;
let tileWidth = tileset.tilewidth;
let tileHeight = tileset.tileheight;
// map width in pixels
let mapWidth = tileMap.width * tileWidth;
// map height in pixels
let mapHeight = tileMap.height * tileHeight;

// Here we will have the randomly spawn function
//the function will take a mapWidth, tileWidth, mapHeight, tileHeight
//will randomly spawn making sure not to land on a current player

function randomizeXY() {
  const maxX = mapWidth / tileWidth;
  const maxY = mapHeight / tileHeight;
  //5 represents 3 as the min, so that the ship always spawns 3 tiles from the min border
  //and 2 so that the ship always spawns 3 away from the max (its exclusive so its really -3 + 1)
  const minX = 5;
  const minY = 5;
  //if we ever want to change the harbor size(right now were assuming 3x3) we would change these values!
  const borderOffset = 3;
  let startPosition = {};

  startPosition.x =
    Math.floor(Math.random() * (maxX - minX) + borderOffset) * tileWidth;
  startPosition.y =
    Math.floor(Math.random() * (maxY - minY) + borderOffset) * tileHeight;
  return startPosition;
}

function worldXYToTileXY(worldX, worldY) {
  // Converts the players coordinates in pixel coordinates to their location in tile coordinates

  let x = Math.floor(worldX / tileWidth);
  let y = Math.floor(worldY / tileHeight);

  return {
    x,
    y
  };
}

function tileXYToWorldXY(tileX, tileY) {
  let x = tileX * tileWidth + tileWidth / 2;
  let y = tileY * tileHeight + tileHeight / 2;
  return {
    x,
    y
  };
}
/* 
The tileMap exported by Tiled and that we use to represent the tileMap in the redux store is a flat array, so we must transform the grid style indicies as in the b array below (b[x][y]) into a single index as in a array (a[ind]) such that a[ind] === b[x][y]

let a = [1,2,3,4,5,6,7,8,9]
let b = [
  [1,2,3],
  [4,5,6],
  [7,8,9]
]

However, Phaser represents a tileMap as so (aka the bottom right quadrant of a graph):

  [0,0][1,0][2,0]
  [0,1][1,1][2,1]
  [0,2][1,2][2,2]

Whereas in Javascript arrays are:

  [0,0][0,1][0,2]
  [1,0][1,1][1,2]
  [2,0][2,1][2,2]

Thus, x and y are reversed.
 */
function XYToInd(x, y, rowLength) {
  // convert x y coords to an ind value for a flat array
  return x * rowLength + y;
}

function IndToXY(Ind, rowLength) {
  // convert an ind in a flat array to the corresponding x y in a grid
  let jsY = Ind % +rowLength;
  let jsX = Math.round((Ind - jsY) / +rowLength);

  return {
    x: jsY,
    y: jsX
  };
}

function getTileIndices() {
  let tileValues = {};

  // tileset is an array of the different tile indices and types
  tileset.tiles.forEach(tile => {
    // these are the types and ids set by tiled and the id is equivalent to the value stored in layers.data -1
    // so we add 1 here to make them in sync to the value loaded into phaser in our tilemap

    let tileIndex = +tile.id + 1;

    // if it doesn't exist then add it
    if (!tileValues[tile.type]) {
      tileValues[tile.type] = tileIndex;
    } else if (typeof tileValues[tile.type] !== 'number') {
      // for types that have multiple indices we want to store it as an array.

      // First check if it's already an array
      // if so push it to the array
      tileValues[tile.type].push(tileIndex);
    } else {
      // otherwise make it into an array with both values
      let tileIndexArr = [tileValues[tile.type], tileIndex];
      tileValues[tile.type] = tileIndexArr;
    }
  });
  return tileValues;
}

function initTileMap(roomId, regularIndex, serverStore, serverActionCreators) {
  // set the tilemap in the server store when the server starts up
  serverStore.dispatch(
    serverActionCreators.tiles.initTileMap(
      tileMap.layers[0].data,
      tileMap.layers[0].width,
      roomId,
      regularIndex
    )
  );
}

module.exports = {
  XYToInd,
  IndToXY,
  randomizeXY,
  worldXYToTileXY,
  tileXYToWorldXY,
  getTileIndices,
  initTileMap
};
