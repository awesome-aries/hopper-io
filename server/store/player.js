/* eslint-disable no-case-declarations */
const {Player} = require('../db/models');
const {randomizeXY, worldXYToTileXY} = require('../game/utils');
const {getTileIndices} = require('../game/utils');
/**
 * ACTION TYPES
 */
const ADDED_PLAYER = 'ADDED_PLAYER';
const REMOVED_PLAYER = 'REMOVED_PLAYER';
const PLAYER_START_GAME = 'PLAYER_START_GAME';
const MOVE_PLAYER = 'MOVE_PLAYER';
const PLAYER_KILLED = 'PLAYER_KILLED';

/**
 * INITIAL STATE
 */

const initialState = {
  players: [],
  tileValues: getTileIndices(), //get tile values from tiled exported json
  rooms: [
    {
      id: 1,
      isFull: false,
      players: [] //array of socketIds
    }
  ], //right now can support 3 players
  gameIsFull: false
};

console.log('initialState', initialState);

/**
 * ACTION CREATORS
 */
const playersActionCreators = {
  addedPlayer: player => ({
    type: ADDED_PLAYER,
    player
  }),
  removedPlayer: removedPlayer => ({
    type: REMOVED_PLAYER,
    removedPlayer
  }),
  playerStartGame: (updatedPlayer, updatedTileValues) => ({
    type: PLAYER_START_GAME,
    updatedPlayer,
    updatedTileValues
  }),
  movePlayer: updatedPlayer => ({
    type: MOVE_PLAYER,
    updatedPlayer
  }),
  playerKilled: (killedPlayer, harborIndex, pathIndex) => ({
    type: PLAYER_KILLED,
    killedPlayer,
    harborIndex,
    pathIndex
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
  return async (dispatch, getState) => {
    try {
      // update our player to be playing and the starting pos
      // Randomize spawn location
      let worldStartPos = randomizeXY();
      let tileStartPos = worldXYToTileXY(worldStartPos.x, worldStartPos.y);
      let {players: {tileValues}} = getState();

      let updatedTileValues = {...tileValues};

      const player = await Player.findOne({
        where: {
          socketId: socketId
        }
      });

      await player.update({
        isPlaying: true,
        name: name,
        worldX: worldStartPos.x,
        worldY: worldStartPos.y,
        // need to invert for store
        x: tileStartPos.y,
        y: tileStartPos.x,
        phaserX: tileStartPos.x,
        phaserY: tileStartPos.y,
        harborIndex: updatedTileValues.harbor.shift(),
        pathIndex: updatedTileValues.path.shift()
      });

      //and update in our store
      dispatch(
        playersActionCreators.playerStartGame(
          player.dataValues,
          updatedTileValues
        )
      );
    } catch (error) {
      console.error(error);
    }
  };
};

const removePlayer = socketId => {
  return async (dispatch, getState) => {
    try {
      const player = await Player.findOne({
        where: {
          socketId: socketId
        }
      });
      // save field values
      let removedPlayer = player.dataValues;
      // and remove them from our database
      await player.destroy();

      dispatch(playersActionCreators.removedPlayer(removedPlayer));
    } catch (error) {
      console.error(error);
    }
  };
};

const playerKilled = socketId => {
  return async dispatch => {
    try {
      const player = await Player.findOne({
        where: {
          socketId: socketId
        }
      });
      let harborIndex = player.harborIndex;
      let pathIndex = player.pathIndex;
      // revert to initial state
      await player.update({
        isPlaying: false,
        tileIndex: null,
        harborIndex: null,
        worldY: 0,
        x: 0,
        y: 0,
        phaserX: 0,
        phaserY: 0,
        direction: 'north'
      });

      dispatch(
        playersActionCreators.playerKilled(
          player.dataValues,
          harborIndex,
          pathIndex
        )
      );
    } catch (error) {
      console.error(error);
    }
  };
};

const movePlayer = (socketId, worldXY, direction) => {
  return async dispatch => {
    try {
      const player = await Player.findOne({
        where: {
          socketId: socketId
        }
      });

      let tilePos = worldXYToTileXY(worldXY.x, worldXY.y);

      await player.update({
        isPlaying: true,
        worldX: worldXY.x,
        worldY: worldXY.y,
        // need to invert for store
        x: tilePos.y,
        y: tilePos.x,
        phaserX: tilePos.x,
        phaserY: tilePos.y,
        direction: direction
      });
      dispatch(playersActionCreators.movePlayer(player.dataValues));
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
        players: [
          ...state.players,
          {
            socketId: action.player.socketId,
            name: action.player.name,
            phaserX: action.player.phaserX,
            phaserY: action.player.phaserY,
            worldX: action.player.worldX,
            worldY: action.player.worldY,
            x: action.player.x,
            y: action.player.y,
            isPlaying: action.player.isPlaying
          }
        ]
      };
    case REMOVED_PLAYER:
      // make the tile values avaiable again
      let tileValuesCopy = {...state.tileValues};
      tileValuesCopy.harbor.push(action.removedPlayer.harborIndex);
      tileValuesCopy.path.push(action.removedPlayer.pathIndex);
      return {
        ...state,
        players: state.players.filter(player => {
          return player.socketId !== action.socketId;
        }),
        tileValues: tileValuesCopy
      };
    case PLAYER_KILLED:
      // need to readd their tile values to the avaiable ones
      let newTileValues = {...state.tileValues};
      newTileValues.harbor.push(action.harborIndex);
      newTileValues.path.push(action.pathIndex);
      return {
        ...state,
        players: state.players.map(player => {
          if (player.socketId === action.killedPlayer.socketId) {
            return action.killedPlayer;
          } else {
            return player;
          }
        }),
        tileValues: newTileValues
      };
    case PLAYER_START_GAME:
      // update the player with game info
      return {
        ...state,
        players: state.players.map(player => {
          if (player.socketId === action.updatedPlayer.socketId) {
            return {
              ...player,
              isPlaying: true,
              phaserX: action.updatedPlayer.phaserX,
              phaserY: action.updatedPlayer.phaserY,
              worldX: action.updatedPlayer.worldX,
              worldY: action.updatedPlayer.worldY,
              x: action.updatedPlayer.x,
              y: action.updatedPlayer.y,
              harborIndex: action.updatedPlayer.harborIndex,
              pathIndex: action.updatedPlayer.pathIndex
            };
          } else {
            return player;
          }
        }),
        tileValues: action.updatedTileValues,
        gameIsFull: action.updatedTileValues.harbor.length > 0 //as long as there are unassigned tiles, then game is not full
      };
    case MOVE_PLAYER:
      return {
        ...state,
        players: state.players.map(player => {
          if (player.socketId === action.updatedPlayer.socketId) {
            return {
              ...player,
              phaserX: action.updatedPlayer.phaserX,
              phaserY: action.updatedPlayer.phaserY,
              worldX: action.updatedPlayer.worldX,
              worldY: action.updatedPlayer.worldY,
              x: action.updatedPlayer.x,
              y: action.updatedPlayer.y,
              direction: action.updatedPlayer.direction
            };
          } else {
            return player;
          }
        })
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
  playerStartGame,
  movePlayer,
  playerKilled
};
