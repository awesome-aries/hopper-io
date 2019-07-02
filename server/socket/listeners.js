//will have all the socket listeners and how they should interact with the data they are given
const {serverStore, serverActionCreators} = require('../store/index');

function initServerListeners(io, socket) {
  // set up all our socket listeners

  // if a new user connects
  onConnect(socket);

  // if a user disconnects
  socket.on('disconnect', () => onDisconnect(socket));
}

function onConnect(socket) {
  console.log(`A socket connection to the server has been made: ${socket.id}`);
  //before this takes place we want to take socketId, use it to randmoize XY position, save it to store and emit to client side store and then when saving the player save the position with it(?)

  //adding player to the server side player reducer
  serverStore.dispatch(serverActionCreators.players.addPlayer(socket.id));

  // send the players object to the new player
  const {players} = serverStore.getState();
  console.log(players);
  socket.emit('currentPlayers', players);
  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);
}

function onDisconnect(socket) {
  console.log(`Connection ${socket.id} has left the building`);

  // When a player disconnects, remove that player from our store
  serverStore.dispatch(serverActionCreators.players.removePlayer(socket.id));

  // get the new state
  const {players} = serverStore.getState();
  // and send it to all the other players
  socket.broadcast.emit('removedPlayer', players);
}

module.exports = initServerListeners;
