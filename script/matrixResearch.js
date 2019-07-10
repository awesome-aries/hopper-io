//const inside = require('point-in-polygon');

function insidePoly(point, corners) {
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

let isInside = insidePoly({x: 7, y: 2}, [
  [8, 3],
  [8, 1],
  [3, 1],
  [3, 4],
  [5, 4],
  [5, 6],
  [7, 5]
]);
console.log('is INSIDE?', isInside);

const createTileMatrix = (x, y) => {
  // generates the matrix representation of our plane

  // 0 = unowned tile
  // 1 = tile is path
  // 2 = a filled in area, part of the harbor
  return Array(x)
    .fill(Array(y))
    .map(el => {
      return el.fill(0);
    });
};

const transformPxToCoords = (
  userPos,
  boardDimensionsPx,
  boardDimensionsCoords
) => {
  // userPos is the pixel postion in the game scene
  // boardDimensionsPx = Ex: {width: 800, height: 800}
  // boardDimensionsCoords = Ex: {x: 10, y: 10 }
  // return the users position in terms of matrix x and y
  // TODO
};

const setPath = (
  prevCartPos,
  nextCartPos,
  tileMatrix,
  exitPoint,
  entryPoint
) => {
  // prevCartPos = {x: 1, y: 1}   -- the tile the cart was on before
  // nextCartPos = {x: 1, y: 1}   -- the new tile the cart is now on
  // tileMatrix, an array of arrays where
  // 0 = unowned tile
  // 1 = tile is path
  // 2 = a filled in area, part of the harbor

  // Sets the current tile that the user is on as the path and sets the entry and exit points
  let prevVal = tileMatrix[prevCartPos.x][prevCartPos.y];
  let nextVal = tileMatrix[nextCartPos.x][nextCartPos.y];

  // If the user is moving from harbor to sea (2 to 0), then we must set the exit point
  if (prevVal === 2 && nextVal === 0) {
    exitPoint = nextCartPos;
  } else if (prevVal === 0 && nextVal === 2) {
    // If the user is moving from sea to harbor (0 to 2), then we must set the entry point
    entryPoint = nextCartPos;
    // once we set our entry point we want to find the point at which to start filling
    findFillPoint(tileMatrix, entryPoint, exitPoint);
  }
  tileMatrix[nextCartPos.x][nextCartPos.y] = 1;
};

const findFillPoint = (tileMatrix, entryPoint, exitPoint) => {
  // tileMatrix, an array of arrays representing the plane
  // entry point, {x, y} the point at which the cart reentered the harbor
  // exit point, {x, y} the point at which the cart exited the harbor

  // this finds the point according to the start and end points on the path, a point within the enclosed area where we want to begin filling

  let fillPoint;

  // once we find the fill point, we then want to call floodFillArea with that point.
  floodFillArea(tileMatrix, fillPoint);
};

// eslint-disable-next-line complexity
const getSurroundingSquares = (tile, tileMatrix) => {
  // tileMatrix, an array of arrays representing the plane
  // tile = {x, y}

  //get range of the surrounding square coordinates
  // if the value of the tile is 0 then get all
  // but if the value is 1 (on the path), then we only want to grab
  // surrounding squares that are also value 1

  let xmin = tile.x - 1 < 0 ? 0 : tile.x - 1;
  let ymin = tile.y - 1 < 0 ? 0 : tile.y - 1;

  let boardDimensions = {
    x: tileMatrix.length,
    y: tileMatrix[0].length
  };
  let tileValue = tileMatrix[tile.x][tile.y];

  let xmax = tile.x + 1 >= boardDimensions ? boardDimensions - 1 : tile.x + 1;
  let ymax = tile.y + 1 >= boardDimensions ? boardDimensions - 1 : tile.y + 1;

  let range = {xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax};
  let tiles = [];

  for (let i = range.xmin; i <= range.xmax; i++) {
    for (let j = range.ymin; j <= range.ymax; j++) {
      if (tileValue === 0 || (tileValue === 1 && tileMatrix[i][j] === 1)) {
        tiles.push({x: i, y: j});
      }
    }
  }
  return tiles;
};

const floodFillArea = (tileMatrix, startPoint) => {
  // tileMatrix, an array of arrays
  // startPoint = {x, y}

  //Fill an area enclosed by path (including the tiles in the path itself)

  //stack of squares to examine
  let toExplore = [startPoint];
  let currentTile;

  while (toExplore.length > 0) {
    //look at next square in the stack and the surrounding squares
    currentTile = toExplore.shift();
    toExplore = toExplore.concat(getSurroundingSquares(currentTile));

    // whether the square is part of the path, or not fill it and make it part of the harbor
    tileMatrix[currentTile.x][currentTile.y] = 2;
  }
  return tileMatrix;
};

let plane = createTileMatrix(10);
