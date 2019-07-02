//will have all the socket listeners and how they should interact with the data they are given
const {serverStore, serverActionCreators} = require('../store/index');

const {addPlayer, removePlayer} = require('../store/player');

function initServerListeners(io, socket) {
  // set up all our socket listeners

  // if a new user connects
  onConnect(socket);

  // if a user disconnects
  socket.on('disconnect', () => onDisconnect(socket));
}

function onConnect(socket) {
  console.log(`A socket connection to the server has been made: ${socket.id}`);

  // The user has hit the homepage, but we dont want to do anything else yet

  // create a player, but not adding them to the game yet
  createNewPlayer(socket.id);

  // send the players object to the new player
  const {players} = serverStore.getState();
  console.log(players);
  socket.emit('currentPlayers', players);
  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);
}

function createNewPlayer(socketId) {
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
  serverStore.dispatch(addPlayer(player));
}

async function onDisconnect(socket) {
  console.log(`Connection ${socket.id} has left the building`);

  // When a player disconnects, remove that player from our store and database
  await serverStore.dispatch(removePlayer(socket.id));

  // get the new state
  const {players} = serverStore.getState();

  // and send the new list of all the players to the players
  socket.broadcast.emit('removedPlayer', players);
}

module.exports = initServerListeners;
