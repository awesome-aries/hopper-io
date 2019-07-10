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
export function XYToInd(x, y, rowLength) {
  // convert x y coords to an ind value for a flat array
  return x * rowLength + y;
}

export function IndToXY(Ind, rowLength) {
  // convert an ind in a flat array to the corresponding x y in a grid
  let jsY = Ind % +rowLength;
  let jsX = Math.round((Ind - jsY) / +rowLength);

  return {
    x: jsY,
    y: jsX
  };
}

// get the map width and height from the tilemap
import tileMap from '../../public/assets/hopperio-tilemap.json';

let [tileset] = tileMap.tilesets;
let tileWidth = tileset.tilewidth;
let tileHeight = tileset.tileheight;
// // map width in pixels
// let mapWidth = tileMap.width * tileWidth;
// // map height in pixels
// let mapHeight = tileMap.height * tileHeight;

export function tileXYToWorldXY(tileX, tileY) {
  let x = tileX * tileWidth + tileWidth / 2;
  let y = tileY * tileHeight + tileHeight / 2;
  return {
    x,
    y
  };
}
