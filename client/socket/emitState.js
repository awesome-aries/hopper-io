import socket from './';

function emitState(playerWorldXY, direction, tilemapDiff) {
  // the player should send not the whole tilemap, but a diff of what has changed in their tilemap.
  // tilemapDiff is an array of objects with the store tileMap ind and the tile index
  // here we want to emit to the server when our player moves and the new state of the player in update of our playScene
  // so call this in the ship's setPath

  socket.emit('playerMove', playerWorldXY, direction, tilemapDiff);
}

export default emitState;
