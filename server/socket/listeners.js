//will have all the socket listeners and how they should interact with the data they are given
const {serverStore, serverActionCreators} = require('../store/index');

const {addPlayer, removePlayer, playerStartGame} = require('../store/player');

function initServerListeners(io, socket) {
  // set up all our socket listeners

  // if a new user connects
  onConnect(socket);

  // if a user disconnects
  socket.on('disconnect', () => onDisconnect(socket));

  // When the player has moved we want to update their location in store and the new tilemap
  socket.on('playerMove', (worldX, worldY, direction, tilemap) =>
    onPlayerMove(socket, worldX, worldY, direction, tilemap)
  );

  socket.on('playerStartGame', (socketId, name) =>
    onPlayerStartGame(socket, socketId, name)
  );
}

async function onConnect(socket) {
  console.log(`A socket connection to the server has been made: ${socket.id}`);

  // The user has hit the homepage, but we dont want to do anything else yet

  // create a player, but not adding them to the game yet
  await createNewPlayer(socket.id);
}

async function createNewPlayer(socketId) {
  //before this takes place we want to take socketId, use it to randmoize XY position, save it to store and emit to client side store and then when saving the player save the position with it(?)

  // initialize player with starting info
  let player = {
    socketId: socketId,
    name: 'grace',
    worldX: 0, //initialize to 0 and update with actual coords once they start
    worldY: 0,
    x: 0,
    y: 0,
    direction: 'north'
  };

  //adding player to our store and database, but not playing yet
  await serverStore.dispatch(addPlayer(player));
}

async function onPlayerStartGame(socket, socketId, name) {
  // this is called when the player hits the play game button and is navigated to the gameview component.

  await playerStartGame(socketId, name);

  // get all the players currently in the state
  const {players} = serverStore.getState();

  // make a copy of players and remove the current player from the object so the player only gets their opponents
  const playersCopy = players.filter(player => {
    return player.socketId !== socket.id;
  });

  console.log('otherPlayers', playersCopy);
  socket.emit('otherPlayers', playersCopy);

  // send the new player to all other players
  let newPlayer = players.find(player => {
    return player.socketId === socket.id;
  });
  console.log('newPlayer', newPlayer);
  socket.broadcast.emit('newPlayer', newPlayer);
}

function onPlayerMove(socket, worldX, worldY, direction, tilemap) {
  // when each player moved we want to update their location and new tilemap in the store and the
  // and then broadcast the new state to all the other players
  // socket.broadcast.emit('updateState', *newData*)
}

async function onDisconnect(socket) {
  console.log(`Connection ${socket.id} has left the building`);

  // When a player disconnects, remove that player from our store and database
  await serverStore.dispatch(removePlayer(socket.id));

  // and send the id of player to remove to the other players
  socket.broadcast.emit('removedPlayer', socket.id);
}

module.exports = initServerListeners;