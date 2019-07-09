//will have all the socket listeners and how they should interact with the data they are given
const {serverStore, serverActionCreators} = require('../store/index');
const Rooms = require('./rooms');

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

  socket.on('playerStartGame', name => onPlayerStartGame(socket, name));

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

async function onPlayerStartGame(socket, name) {
  // this is called when the player hits the play game button and is navigated to the gameview component.

  // assign them a room
  const roomId = Rooms.assignRoom();
  // and join the room
  socket.join(roomId);

  // update the player
  await serverStore.dispatch(playerStartGame(socket.id, name, roomId));

  // get all the players currently in the state
  const {players: {players}, tiles} = serverStore.getState();

  // make a copy of players and remove the current player from the object so the player only gets their opponents
  // also make sure not sending any players not yet in the game
  // and only players in the same room
  const playersCopy = players.filter(player => {
    return (
      player.isPlaying &&
      player.roomId === roomId &&
      player.socketId !== socket.id
    );
  });

  // get the new player
  let newPlayer = players.find(player => {
    return player.socketId === socket.id;
  });

  // also need to send them the current tilemap to the new player
  console.log('startingInfo', playersCopy, 'newPlayer', newPlayer);
  socket.emit(
    'startingInfo',
    playersCopy,
    newPlayer,
    tiles.tileMap.present,
    tiles.tileMapRowLength
  );

  // send the newPlayer to the other players in the room
  socket.broadcast.to(roomId).emit('newPlayer', newPlayer);
}

async function onPlayerMove(socket, worldXY, direction, tilemapDiff) {
  // when each player moved we want to update their location and new tilemap in the store
  const oldState = serverStore.getState();
  let oldPlayer = oldState.players.players.find(player => {
    return player.socketId === socket.id;
  });

  // check to see if player is still playing and only update if so, necessary because after player was killed, last move was still sending updateState
  if (oldPlayer.isPlaying) {
    // update the tilemap
    // not a thunk rn, just in store but need to make a thunk and place in DB
    // TODO
    await serverStore.dispatch(
      serverActionCreators.tiles.updateTileMap(tilemapDiff)
    );

    // update the player location
    await serverStore.dispatch(movePlayer(socket.id, worldXY, direction));

    // get the new state
    const {players: {players}, tiles: {tileMapDiff}} = serverStore.getState();

    // make a copy of players and make sure not sending any players not yet in the game
    // and only players in the room
    const playersCopy = players.filter(player => {
      return player.isPlaying && player.roomId === oldPlayer.roomId;
    });

    // and then broadcast the new state to all the other players
    socket.broadcast
      .to(oldPlayer.roomId)
      .emit('updateState', playersCopy, tileMapDiff);

    // and clear the changes we just broadcast to the clients
    serverStore.dispatch(serverActionCreators.tiles.resetTileMapDiff());
  }
}

async function onPlayerKilled(io, socket, pathIndex) {
  // console.log(`Player ${socket.id} was killed`);

  let oldState = serverStore.getState();

  // get the player that was killed
  let killedPlayer = oldState.players.players.find(player => {
    return player.pathIndex === pathIndex;
  });

  if (killedPlayer) {
    // check that player exists because sometimes you can hit a players path tile twice and double kill them before the state is updated.
    console.log('killedPlayer previous vals:', killedPlayer);

    // emit to that player that they died
    io.to(`${killedPlayer.socketId}`).emit('wasKilled');
    console.log(`Player ${killedPlayer.socketId} was killed by ${socket.id}`);

    // leave the room
    Rooms.leaveRoom(killedPlayer.roomId);

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
    const {tiles: {tileMapDiff}} = serverStore.getState();

    // sending to all clients in specified room, including sender
    // send back to all players to remove opponent and update map
    io
      .in(killedPlayer.roomId)
      .emit('removePlayer', killedPlayer.socketId, tileMapDiff);
  }
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

  // and send the id of player to remove to the other players if the player left while currently playing
  if (oldPlayer.isPlaying) {
    // leave the room
    Rooms.leaveRoom(oldPlayer.roomId);

    // clear that players path and harbor tiles from the tilemap
    await serverStore.dispatch(
      serverActionCreators.tiles.removePlayersTiles(
        oldPlayer.pathIndex,
        oldPlayer.harborIndex,
        oldState.players.tileValues.regular
      )
    );
    // get the new state
    const {tiles: {tileMapDiff}, players: {players}} = serverStore.getState();
    console.log('current players &&&&&&&&&&&', players);

    socket.broadcast
      .to(oldPlayer.roomId)
      .emit('removePlayer', socket.id, tileMapDiff);
  }
}

module.exports = initServerListeners;
