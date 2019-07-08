/* eslint-disable no-bitwise */
/*
Bit Map

8 bits per square allows for 64 different tiles
1 regular
30 path
30 harbor
3 left over

each tile already has an index assigned which is an integer

a 50*50 board has 2500 tiles
*/
function convertTileMapToBitfield(bits, tileMap) {
  // we want 4 bits for each tile
  return tileMap.reduce((bitfield, tileIndex) => {
    // shift the bitfield over by number of bits
    bitfield = bitfield << bits;
    console.log('shifted bitfield', bitfield.toString(2));

    // and then set the tileIndex value
    bitfield |= tileIndex;
    console.log('length of bitfield', bitfield.toString(2).length);
    console.log('tileIndex', tileIndex.toString(2));
    console.log('tileset bitfield', bitfield.toString(2));

    return bitfield;
  }, 0b0);
}
function convertBitfieldToTileMap(bits, bitfield, tileMapLength) {
  // initialize tilemap to array
  let tileMap = Array(tileMapLength);
  // get the bitfield in binary and left pad any leading zeros
  let binaryString = bitfield.toString(2).padStart(bits * tileMapLength, '0');
  console.log('binaryString', binaryString);
  // go through the bitString and convert back to integers and put in tileMap
  for (
    let i = binaryString.length, tileMapIterator = tileMapLength - 1;
    i - bits >= 0;
    i -= bits, --tileMapIterator
  ) {
    let subBitmask = binaryString.substring(i - bits, i);
    console.log('subBitmask', subBitmask);

    // go through the binary string from the end
    let tileIndex = parseInt(subBitmask, 2);
    console.log('tileIndex', tileIndex);

    tileMap[tileMapIterator] = tileIndex;
  }
  return tileMap;
}
function createBitmask(bits, tileMapDiff, tileMapLength) {
  let [bitmask, clearingMask] = tileMapDiff.reduce(
    ([bitmask, clearingMask], {tileInd, tileIndex}) => {
      // set the value
      let subBitmask = 0b0 | tileIndex;
      // then shift it into place
      subBitmask = subBitmask << (bits * (tileMapLength - tileInd));
      // then set it on the bitmask
      bitmask |= subBitmask;

      // we also want to make a mask that clears the 8bit sections we want to set with our mask. the parts we want to clear should be 0b0000, and the ones we want to keep the same should be 0b1111. Then we 'and' that against the tilemap, and then 'or' against our bitmask to set the values.
      // we'll invert this at the end
      let subClearingMask = 0b11111111 << (bits * (tileMapLength - tileInd));
      console.log('subClearingMask', subClearingMask.toString(2));
      clearingMask |= subClearingMask;
      console.log('clearingMask', clearingMask.toString(2));
      return [bitmask, clearingMask];
    },
    [0b0, 0b0]
  );
  // invert by casting to an unsigned integer and then 'not'
  return [bitmask, ~clearingMask >>> 0];
}

function setBitmapValue(bitfield, bitmask, clearingMask) {
  // returns new tileMap bitfield with the new values
  // first clear the fields we want to set
  bitfield &= clearingMask;
  // then set the values from our bitmask
  bitfield |= bitmask;
  return bitfield;
}

let map = [0, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5];
// for (let i = 0, j = 0; i < 50; i++, j++) {
//   j = j > 8 ? 0 : j;
//   map.push(j);
// }
console.log('map', map);
let bits = 4;
let bitfield = convertTileMapToBitfield(bits, map);

console.log('*******************');

let updatedMap = convertBitfieldToTileMap(bits, bitfield, map.length);
console.log('updatedMap', updatedMap);

// let diff = [{tileInd: 0, tileIndex: 5}, {tileInd: 2, tileIndex: 2}];
// console.dir(diff);
// let [bitmask, clear] = createBitmask(bits, diff, map.length);
// console.log(
//   `bitmask: ${bitmask.toString(2)}, clearingMask: ${(clear >>> 0).toString(2)}`
// );

// let updatedBitfield = setBitmapValue(bitfield, bitmask, clear);
// console.log('updatedBitfield', updatedBitfield.toString(2));

// let updatedMap = convertBitfieldToTileMap(bits, updatedBitfield, map.length);
// console.log('updatedMap', updatedMap);
