const {Player} = require('../db/models');
const {randomizeXY, worldXYToTileXY} = require('../game/utils');
/**
 * ACTION TYPES
 */
const ADDED_PLAYER = 'ADDED_PLAYER';
const REMOVED_PLAYER = 'REMOVED_PLAYER';
const PLAYER_START_GAME = 'PLAYER_START_GAME';

/**
 * INITIAL STATE
 */

const initialState = [];

/**
 * ACTION CREATORS
 */
const playersActionCreators = {
  addedPlayer: player => ({
    type: ADDED_PLAYER,
    player
  }),
  removedPlayer: socketId => ({
    type: REMOVED_PLAYER,
    socketId
  }),
  playerStartGame: updatedPlayer => ({
    type: PLAYER_START_GAME,
    updatedPlayer
  })
};

/**
 * THUNK CREATORS
 */

const addPlayer = playerInfo => {
  return async (dispatch, getState) => {
    try {
      // add the player to our database
      const player = await Player.create({
        socketId: playerInfo.socketId,
        name: playerInfo.name,
        worldX: playerInfo.worldX,
        worldY: playerInfo.worldY,
        phaserX: playerInfo.phaserX,
        phaserY: playerInfo.phaserY,
        x: playerInfo.x,
        y: playerInfo.y,
        direction: playerInfo.direction,
        isPlaying: false //defaults to false
      });

      let playerObj = await player.get({plain: true});

      //add player to our store
      dispatch(playersActionCreators.addedPlayer(playerObj));
    } catch (error) {
      console.error(error);
    }
  };
};

// may not need to separate this from add player.... might just be able to create player here
const playerStartGame = (socket, socketId, name) => {
  console.log('hello?????????');
  return async (dispatch, getState) => {
    try {
      console.log('were in playerStartGame thunk2');
      // update our player to be playing and the starting pos
      // Randomize spawn location
      let worldStartPos = randomizeXY();
      let tileStartPos = worldXYToTileXY(worldStartPos.x, worldStartPos.y);

      const [, [updatedPlayer]] = await Player.update(
        {
          isPlaying: true,
          name: name,
          worldX: worldStartPos.x,
          worldY: worldStartPos.y,
          x: tileStartPos.x,
          y: tileStartPos.y,
          phaserX: tileStartPos.y,
          phaserY: tileStartPos.x
        },
        {
          where: {
            socketId: socketId
          },
          returning: true,
          plain: true // makes sure that the returned instances are just plain objects
        }
      );
      console.log('****************************');
      console.log('updatedPlayer', updatedPlayer);
      console.log('****************************');
      //and update in our store
      dispatch(playersActionCreators.playerStartGame(updatedPlayer));
      // get all the players currently in the state
      const {players} = getState();

      // also need to send them the current tilemap
      // TODO

      // make a copy of players and remove the current player from the object so the player only gets their opponents
      // also make sure not sending any players not yet in the game
      const playersCopy = players.filter(player => {
        return player.isPlaying && player.socketId !== socket.id;
      });

      // get the new player
      let newPlayer = players.find(player => {
        return player.socketId === socket.id;
      });

      console.log('startingInfo', playersCopy, newPlayer);
      socket.emit('startingInfo', playersCopy, newPlayer);

      // send the newPlayer to the other players
      console.log('newPlayer', newPlayer);
      socket.broadcast.emit('newPlayer', newPlayer);
    } catch (error) {
      console.error(error);
    }
  };
};

const removePlayer = socketId => {
  return async (dispatch, getState) => {
    try {
      // and remove them from our database
      await Player.destroy({
        where: {
          socketId: socketId
        }
      });

      dispatch(playersActionCreators.removedPlayer(socketId));
    } catch (error) {
      console.error(error);
    }
  };
};

/**
 * REDUCER
 */
function playersReducer(state = initialState, action) {
  switch (action.type) {
    case ADDED_PLAYER:
      return [
        ...state,
        {
          socketId: action.player.socketId,
          name: action.player.name,
          phaserX: action.player.phaserX,
          phaserY: action.player.phaserY,
          worldX: action.player.worldX,
          worldY: action.player.worldY,
          x: action.player.y,
          y: action.player.x,
          isPlaying: action.player.isPlaying
        }
      ];
    case REMOVED_PLAYER:
      return state.filter(player => {
        return player.socketId !== action.socketId;
      });
    case PLAYER_START_GAME:
      // update the player with new
      return state.map(player => {
        if (player.socketId === action.updatedPlayer.socketId) {
          return {
            ...player,
            isPlaying: true,
            phaserX: action.updatedPlayer.phaserX,
            phaserY: action.updatedPlayer.phaserY,
            worldX: action.updatedPlayer.worldX,
            worldY: action.updatedPlayer.worldY,
            x: action.updatedPlayer.y,
            y: action.updatedPlayer.x
          };
        } else {
          return player;
        }
      });
    default:
      return state;
  }
}

module.exports = {
  playersReducer,
  playersActionCreators,
  addPlayer,
  removePlayer,
  playerStartGame
};
