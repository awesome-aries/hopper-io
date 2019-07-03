/**
 * INITIAL STATE
 */
const initialState = {
  // isPlaying should be false, but for testing purposes leave as true
  isPlaying: false,
  playerName: ''
};

/**
 * ACTION TYPES
 */
const START_GAME = 'START_GAME';
const STOP_GAME = 'STOP_GAME';

/**
 * ACTION CREATORS
 */
export const gameStateActionCreators = {
  startGame: name => ({
    type: START_GAME,
    name
  }),
  stopGame: () => ({
    type: STOP_GAME
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
      return {
        ...state,
        isPlaying: true,
        playerName: action.name
      };
    case STOP_GAME:
      return {state, isPlaying: false};
    default:
      return state;
  }
}
