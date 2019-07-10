import tileMap from '../../public/assets/hopperio-tilemap.json';
// const tileMap = require('../public/assets/hopperio-tilemap.json');
export default function() {
  let tileValues = {};
  // right now only have one tileset
  let [tileset] = tileMap.tilesets;

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
