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

  // The onUpdateState listener must be in playScene so that it can manipulate phaser objects
  // socket.on('updateState', (players, newTileMap) => {
  //   onUpdateState(players, newTileMap);
  // });
}

async function onStart(players, thisPlayer, tileMap, tileMapRowLength) {
  // here we'll want to convert the players object into a list that is useable by phaser
  console.log('Here are the other players', players);
  // dispatch INIT_OPPONENTS in opponent reducer
  clientStore.dispatch(clientActionCreators.opponent.setOpponents(players));

  console.log('This is the new player, you!', thisPlayer);

  // set the path and tile values for the player
  await clientStore.dispatch(
    clientActionCreators.game.setTileValues(
      thisPlayer.pathIndex,
      thisPlayer.harborIndex
    )
  );

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

// function onUpdateState(players, newTileMap) {
//   // when we get updates from the server we need to update the tilemap in our store and in phaser...
//   // also update opponents
//   // TODO
// }

export default initClientListeners;
