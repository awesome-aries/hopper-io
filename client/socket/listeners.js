import clientStore, {clientActionCreators} from '../store/index';

function initClientListeners(io, socket) {
  //  set up all our clientside listeners
  console.log('Connected!');
  console.log(`You are ${socket.id}`);

  // let {game: tileMap} = clientStore.getState();

  // console.log(tileMap.present);

  //
  socket.on('startingInfo', (players, thisPlayer, tileMap, tileMapRowLength) =>
    onStart(players, thisPlayer, tileMap, tileMapRowLength)
  );

  socket.on('newPlayer', player => onNewPlayer(player));

  // when another player leaves the game, we want to listen for the server to tell us that the player that left
  socket.on('removedPlayer', removedPlayerID =>
    onRemovedPlayer(removedPlayerID)
  );
}

function onRemovedPlayer(removedPlayerID) {
  // here we'll want to remove the player from our list with filter
  // update the state and then in playScene, we'll populate our opponents from state
  console.log(`This is the player that left:`, removedPlayerID);
  // dispatch removeOpponent in opponent reducer
  // TODO
}

async function onStart(players, thisPlayer, tileMap, tileMapRowLength) {
  // here we'll want to convert the players object into a list that is useable by phaser
  console.log('Here are the other players', players);
  // dispatch INIT_OPPONENTS in opponent reducer
  // TODO

  console.log('This is the new player, you!', thisPlayer);
  console.log('tileMap', tileMap);
  // set the client's tilemap
  await clientStore.dispatch(
    clientActionCreators.game.setTilemap(tileMap, tileMapRowLength)
  );

  // set this players starting position in tile coords
  await clientStore.dispatch(
    clientActionCreators.game.setPlayerXY(
      thisPlayer.x,
      thisPlayer.y,
      thisPlayer.direction
    )
  );

  // we want to change the game state to isPlaying and set their name
  // this should then make the view change from the welcome component to gameView
  await clientStore.dispatch(
    clientActionCreators.gameState.startGame(thisPlayer.name)
  );
}

function onNewPlayer(player) {
  // here we'll want to add the new player to our list
  console.log('A new player has joined', player);
  // dispath action addOpponent in opponet reducer
  // TODO
}

export default initClientListeners;
