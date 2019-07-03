import clientStore from '../store/index';

function initClientListeners(io, socket) {
  //  set up all our clientside listeners
  console.log('Connected!');
  console.log(`You are ${socket.id}`);

  let {game: tileMap} = clientStore.getState();

  console.log(tileMap.present);

  //
  socket.on('currentPlayers', players => onCurrentPlayers(players));

  socket.on('newPlayer', player => onNewPlayer(player));

  // when another player leaves the game, we want to listen for the server to tell us that the player that left
  socket.on('removedPlayer', removedPlayerID =>
    onRemovedPlayer(removedPlayerID)
  );
}

function onRemovedPlayer(removedPlayerID) {
  // here we'll want to remove the player from our list with filter
  console.log(`This is the player that left:`, removedPlayerID);
}

function onCurrentPlayers(players) {
  // here we'll want to convert the players object into a list that is useable by phaser
  console.log('Here are the other players', players);
}

function onNewPlayer(player) {
  // here we'll want to add the new player to our list
  console.log('A new player has joined', player);
}

export default initClientListeners;
