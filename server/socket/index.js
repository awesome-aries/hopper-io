const {serverStore, serverActionTypes} = require('../store/index');

module.exports = io => {
  io.on('connection', socket => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );
    //before this takes place we want to take socketId, use it to randmoize XY position, save it to store and emit to client side store and then when saving the player save the position with it(?)

    //adding player to the server side player reducer
    serverStore.dispatch(serverActionTypes.players.addPlayer(socket.id));

    // send the players object to the new player
    let players = serverStore.getState().playersReducer;
    console.log(players);
    socket.emit('currentPlayers', players);
    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`);
    });
  });
};

// dispatch actions from server reducer in this folder
