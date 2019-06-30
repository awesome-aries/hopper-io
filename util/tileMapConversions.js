// let a = [1,2,3,4,5,6,7,8,9]
// let b = [
//   [1,2,3],
//   [4,5,6],
//   [7,8,9]
// ]

export function XYToInd(x, y, rowLength) {
  // convert x y coords to an ind value for a flat array
  return x * rowLength + y;
}

export function IndToXY(Ind, rowLength) {
  // convert an ind in a flat array to the corresponding x y in a grid
  let y = Ind % +rowLength;
  let x = Math.round((Ind - y) / +rowLength);

  return {x, y};
}

// b[1][1] = 5
// a[x] = 5
