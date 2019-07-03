/**
 * INITIAL STATE
 */
const initialState = {
  // isPlaying should be false, but for testing purposes leave as true
  isPlaying: true,
  playerName: ''
};

/**
 * ACTION TYPES
 */
const START_GAME = 'START_GAME';
const STOP_GAME = 'STOP_GAME';
const SET_PLAYER_NAME = 'SET_PLAYER_NAME';

/**
 * ACTION CREATORS
 */
export const gameStateActionCreators = {
  startGame: () => ({
    type: START_GAME
  }),
  stopGame: () => ({
    type: STOP_GAME
  }),
  setPlayerName: name => ({
    type: SET_PLAYER_NAME,
    name
  })
};

/**
 * THUNK CREATOR
 */
// Need to write a thunk for getting name of players associated with/using socket id

/**
 * REDUCER
 */
export default function gameStateReducer(state = initialState, action) {
  switch (action.type) {
    case START_GAME:
      return {...state, isPlaying: true};
    case STOP_GAME:
      return {state, isPlaying: false};
    case SET_PLAYER_NAME:
      return {state, playerName: action.name};
    default:
      return state;
  }
}
