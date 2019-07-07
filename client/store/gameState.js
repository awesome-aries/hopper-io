/* eslint-disable no-case-declarations */
/**
 * INITIAL STATE
 */
const initialState = {
  // isPlaying should be false, but for testing purposes leave as true
  isPlaying: false,
  playerName: '',
  score: 0,
  playersKilled: 0,
  gameStartTime: null,
  gameEndTime: null,
  duration: null
};

/**
 * ACTION TYPES
 */
const START_GAME = 'START_GAME';
const STOP_GAME = 'STOP_GAME';
const CALCULATE_SCORE = 'CALCULATE_SCORE';

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
  }),
  calculateScore: (tileMap, harborIndex) => ({
    type: CALCULATE_SCORE,
    tileMap,
    harborIndex
  })
};

/**
 * THUNK CREATOR
 */

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
    case CALCULATE_SCORE:
      let numTotalTiles = action.tileMap.length;
      let numHarborTiles = action.tileMap.reduce((numHarbor, tileIndex) => {
        numHarbor += tileIndex === action.harborIndex ? 1 : 0;
        return numHarbor;
      }, 0);
      return {
        ...state,
        score: Math.round(numHarborTiles / numTotalTiles * 100) //get percentage of board that are harborTiles
      };
    default:
      return state;
  }
}
