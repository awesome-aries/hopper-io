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
let plane = createTileMatrix(5);

export const transformPxToCoords = (
  userPos,
  boardDimensionsPx,
  boardDimensionsCoords
) => {
  // userPos is the pixel postion in the game scene
  // boardDimensionsPx = Ex: {width: 800, height: 800}
  // boardDimensionsCoords = Ex: {x: 10, y: 10 }
  // return the users position in terms of matrix x and y
};

export const setPath = (prevCartPos, nextCartPos, tileMatrix) => {
  // cartPos = {x: 1, y: 1}
  // tileMatrix, an array of arrays where
  // 0 = unowned tile
  // 1 = tile is path
  // 2 = a filled in area, part of the harbor

  // Sets the current tile that the user is on as the path and sets the entry and exit points
  tileMatrix[cartPos.x][cartPos.y] = 1;
};

export const getSurroundingSquares = (tile, boardDimensions) => {
  // tile, an array of arrays representing the plane
  // boardDimensions = Ex: {x: 10, y: 10 }
  // tile = {x, y}

  //get range of the surrounding square coordinates
  let xmin = tile.x - 1 < 0 ? 0 : tile.x - 1;
  let ymin = tile.y - 1 < 0 ? 0 : tile.y - 1;

  let xmax = tile.x + 1 >= boardDimensions ? boardDimensions - 1 : tile.x + 1;
  let ymax = tile.y + 1 >= boardDimensions ? boardDimensions - 1 : tile.y + 1;

  return {xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax};
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
