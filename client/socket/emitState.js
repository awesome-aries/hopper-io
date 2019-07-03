import socket from './';

function emitState(playerWorldX, playerWorldY, direction, tilemap) {
  // the player should send not the whole tilemap, but a diff of what has changed in their tilemap.
  // so maybe an array that has 0 value as what has stayed the same, and then a value for what the tile at that position has changed to
  // maybe we can use a bitmask to show what has changed?
  // here we want to emit to the server when our player moves and the new state of the player in update of our playScene
  // so call this in the playScene or ship update

  // write a function to make the diff maybe not here
  let tilemapDiff = [];
  socket.emit('playerMove', playerWorldX, playerWorldY, direction, tilemapDiff);
}

export default emitState;
