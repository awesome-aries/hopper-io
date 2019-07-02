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
  addPlayer: socketId => ({
    type: ADD_PLAYER,
    playerId: socketId
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
        [action.playerId]: {playerId: action.playerId}
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
