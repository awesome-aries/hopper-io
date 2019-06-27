export const createTileMatrix = (x, y) => {
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

export const transformPxToCoords = (
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

export const setPath = (
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
  }
  tileMatrix[nextCartPos.x][nextCartPos.y] = 1;
};

// eslint-disable-next-line complexity
export const getSurroundingSquares = (tile, tileMatrix) => {
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

  for (var i = range.xmin; i <= range.xmax; i++) {
    for (var j = range.ymin; j <= range.ymax; j++) {
      if (tileValue === 0 || (tileValue === 1 && tileMatrix[i][j] === 1)) {
        tiles.push({x: i, y: j});
      }
    }
  }
  return tiles;
};

export const floodFillArea = (tileMatrix, startPoint) => {
  // tileMatrix, an array of arrays
  // startPoint = {x, y}

  //When an empty square is clicked on, reveal all adjacent blank squares until hitting numbers

  //stack of squares to examine
  var toExplore = [startPoint];
  var currentTile, next;

  while (toExplore.length > 0) {
    //look at next square in the stack and the surrounding squares
    currentTile = toExplore.shift();
    next = getSurroundingSquares(currentTile);

    for (var i = next.xmin; i <= next.xmax; i++) {
      for (var j = next.ymin; j <= next.ymax; j++) {
        // whether the square is part of the path, or not fill it and make it part of the harbor
        tileMatrix[i][j] = 2;

        //If the square being looked at isn't owned by anyone, then we want to examine it's neighbors
        if (tileMatrix[i][j] === 0) {
          toExplore.push({x: i, y: j});
        }
      }
    }
  }
  return tileMatrix;
};

let plane = createTileMatrix(10);
