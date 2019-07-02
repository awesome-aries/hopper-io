/**
 * ACTION TYPES
 */
const ADD_PLAYER = 'ADD_PLAYER';
const REMOVE_PLAYER = 'REMOVE_PLAYER';

/**
 * INITIAL STATE
 */

const initialState = {};

/**
 * ACTION CREATORS
 */
const playersActionCreators = {
  addPlayer: player => ({
    type: ADD_PLAYER,
    player
  }),
  removePlayer: socketId => ({
    type: REMOVE_PLAYER,
    playerId: socketId
  })
};

/**
 * THUNK CREATORS
 */

/**
 * REDUCER
 */
function playersReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_PLAYER:
      return {
        ...state,
        [action.player.socketId]: {
          playerId: action.player.socketId,
          name: action.player.name,
          phaserX: action.player.phaserX,
          phaserY: action.player.phaserY,
          x: action.player.x,
          y: action.player.y
        }
      };
    case REMOVE_PLAYER:
      let copyOfState = Object.assign({}, state);
      // remove the player from the object
      delete copyOfState[action.playerId];
      return {
        ...copyOfState
      };
    default:
      return state;
  }
}

module.exports = {
  playersReducer,
  playersActionCreators
};
