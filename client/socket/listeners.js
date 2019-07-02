import clientStore from '../store/index';

function initClientListeners(io, socket) {
  //  set up all our clientside listeners
  console.log('Connected!');
  console.log(`You are ${socket.id}`);

  let {game: tileMap} = clientStore.getState();

  console.log(tileMap.present);

  socket.on('currentPlayers', players => onCurrentPlayers(players));

  socket.on('newPlayer', player => onNewPlayer(player));

  socket.on('removedPlayer', updatedPlayers => onRemovedPlayer(updatedPlayers));
}

function onRemovedPlayer(updatedPlayers) {
  console.log(`These are the new players:`, updatedPlayers);
}

function onCurrentPlayers(players) {
  console.log('Here are the other players', players);
}

function onNewPlayer(player) {
  console.log('A new player has joined', player);
}

export default initClientListeners;
