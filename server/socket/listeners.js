//will have all the socket listeners and how they should interact with the data they are given
const {serverStore, serverActionCreators} = require('../store/index');

const {
  addPlayer,
  removePlayer,
  playerStartGame,
  movePlayer,
  playerKilled
} = require('../store/player');

function initServerListeners(io, socket) {
  // set up all our socket listeners

  // if a new user connects
  onConnect(socket);

  // if a user disconnects
  socket.on('disconnect', () => onDisconnect(socket));

  // When the player has moved we want to update their location in store and the new tilemap
  socket.on('playerMove', (worldXY, direction, tilemap) =>
    onPlayerMove(socket, worldXY, direction, tilemap)
  );

  socket.on('playerStartGame', (socketId, name) =>
    onPlayerStartGame(socket, socketId, name)
  );

  socket.on('playerKilled', pathIndex => {
    onPlayerKilled(io, socket, pathIndex);
  });
}

async function onConnect(socket) {
  console.log(`A socket connection to the server has been made: ${socket.id}`);

  // The user has hit the homepage, but we dont want to do anything else yet

  // create a player, but not adding them to the game yet
  await createNewPlayer(socket.id);
}

async function createNewPlayer(socketId) {
  // we create the player and save them in the store and

  // initialize player with starting info
  let player = {
    socketId: socketId,
    name: 'grace',
    worldX: 0, //initialize to 0 and update with actual coords once they start
    worldY: 0,
    phaserX: 0,
    phaserY: 0,
    x: 0,
    y: 0,
    direction: 'north'
  };

  //adding player to our store and database, but not playing yet
  await serverStore.dispatch(addPlayer(player));
}

async function onPlayerStartGame(socket, socketId, name) {
  // this is called when the player hits the play game button and is navigated to the gameview component.

  await serverStore.dispatch(playerStartGame(socket, socketId, name));

  // get all the players currently in the state
  const {players: {players}, tiles} = serverStore.getState();

  // make a copy of players and remove the current player from the object so the player only gets their opponents
  // also make sure not sending any players not yet in the game
  const playersCopy = players.filter(player => {
    return player.isPlaying && player.socketId !== socket.id;
  });

  // get the new player
  let newPlayer = players.find(player => {
    return player.socketId === socket.id;
  });

  // also need to send them the current tilemap to the new player
  console.log(
    'startingInfo',
    playersCopy,
    'newPlayer',
    newPlayer
    // 'tileMap',
    // tiles.tileMap
  );
  socket.emit(
    'startingInfo',
    playersCopy,
    newPlayer,
    tiles.tileMap.present,
    tiles.tileMapRowLength
  );

  // send the newPlayer to the other players
  console.log('newPlayer', newPlayer);
  socket.broadcast.emit('newPlayer', newPlayer);
}

async function onPlayerMove(socket, worldXY, direction, tilemapDiff) {
  // when each player moved we want to update their location and new tilemap in the store

  // update the tilemap
  // not a thunk rn, just in store but need to make a thunk and place in DB
  // TODO
  await serverStore.dispatch(
    serverActionCreators.tiles.updateTileMap(tilemapDiff)
  );

  // update the player location
  await serverStore.dispatch(movePlayer(socket.id, worldXY, direction));

  // get the new state
  const {players: {players}, tiles} = serverStore.getState();

  // make a copy of players and remove the current player from the object so the player only gets their opponents
  // also make sure not sending any players not yet in the game
  const playersCopy = players.filter(player => {
    return player.isPlaying && player.socketId !== socket.id;
  });

  // and then broadcast the new state to all the other players
  socket.broadcast.emit(
    'updateState',
    playersCopy,
    tiles.tileMap.present,
    tiles.tileMapRowLength
  );
}

async function onPlayerKilled(io, socket, pathIndex) {
  // console.log(`Player ${socket.id} was killed`);

  let oldState = serverStore.getState();

  // get the player that was killed
  let killedPlayer = oldState.players.players.find(player => {
    return player.pathIndex === pathIndex;
  });

  console.log('killedPlayer', killedPlayer);

  // emit to that player that they died
  io.to(`${killedPlayer.socketId}`).emit('wasKilled');
  console.log(`Player ${killedPlayer.socketId} was killed`);

  // update the player in db and store
  await serverStore.dispatch(playerKilled(killedPlayer.socketId));

  // and remove their tiles from the tileMap
  await serverStore.dispatch(
    serverActionCreators.tiles.removePlayersTiles(
      killedPlayer.pathIndex,
      killedPlayer.harborIndex,
      oldState.players.tileValues.regular
    )
  );
  // get the new state
  const {tiles: {tileMap}} = serverStore.getState();

  // send back to the other player the id of the player who left and the new tilemap
  socket.broadcast.emit('removePlayer', killedPlayer.socketId, tileMap.present);
}

async function onDisconnect(socket) {
  console.log(`Connection ${socket.id} has left the building`);

  let oldState = serverStore.getState();
  // get the player that left
  let oldPlayer = oldState.players.players.find(player => {
    return player.socketId === socket.id;
  });

  // When a player disconnects, remove that player from our store and database
  await serverStore.dispatch(removePlayer(socket.id));

  // clear that players path and harbor tiles from the tilemap
  await serverStore.dispatch(
    serverActionCreators.tiles.removePlayersTiles(
      oldPlayer.pathIndex,
      oldPlayer.harborIndex,
      oldState.players.tileValues.regular
    )
  );

  // get the new state
  const {tiles: {tileMap}} = serverStore.getState();

  // and send the id of player to remove to the other players
  socket.broadcast.emit('removePlayer', socket.id, tileMap);
}

module.exports = initServerListeners;
