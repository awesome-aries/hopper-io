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

const initialState = {};

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

const addPlayer = player => {
  return async (dispatch, getState) => {
    try {
      // add the player to our database
      await Player.create({
        socketId: player.socketId,
        name: player.name,
        worldX: player.worldX,
        worldY: player.worldY,
        x: player.x,
        y: player.y,
        direction: player.direction,
        isPlaying: false //defaults to false
      });

      //add player to our store
      dispatch(playersActionCreators.addedPlayer(player));
    } catch (error) {
      console.error(error);
    }
  };
};

// may not need to separate this from add player.... might just be able to create player here
const playerStartGame = (socket, socketId) => {
  return async (dispatch, getState) => {
    try {
      // update our player to be playing and the starting pos
      // Randomize spawn location
      let startPos = randomizeXY();

      const [, [updatedPlayer]] = await Player.update(
        {
          isPlaying: true,
          worldX: startPos.x,
          worldY: startPos.y,
          x: worldXYToTileXY(startPos.x),
          y: worldXYToTileXY(startPos.y)
        },
        {
          where: {
            socketId: socketId
          },
          returning: true,
          plain: true // makes sure that the returned instances are just plain objects
        }
      );
      //and update in our store
      dispatch(playersActionCreators.playerStartGame(updatedPlayer));
      // want to broadcast to the other players that a new player has joined
      socket.broadcast.emit('newPlayer', updatedPlayer);
      // and broadcast to the new player all the players in the game currently
      // const { players }

      // socket.emit('currentPlayers', )
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
      return {
        ...state,
        [action.player.socketId]: {
          socketId: action.player.socketId,
          name: action.player.name,
          phaserX: action.player.phaserX,
          phaserY: action.player.phaserY,
          x: action.player.x,
          y: action.player.y,
          isPlaying: action.player.isPlaying
        }
      };
    case REMOVED_PLAYER:
      // eslint-disable-next-line no-case-declarations
      let copyOfState = Object.assign({}, state);
      // remove the player from the object
      delete copyOfState[action.socketId];
      return {
        ...copyOfState
      };
    case PLAYER_START_GAME:
      return {
        ...state,
        [action.updatedPlayer.socketId]: {
          ...state[action.updatedPlayer.socketId],
          isPlaying: true,
          phaserX: action.updatedPlayer.phaserX,
          phaserY: action.updatedPlayer.phaserY,
          x: action.updatedPlayer.x,
          y: action.updatedPlayer.y
        }
      };
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
