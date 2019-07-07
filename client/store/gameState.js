/* eslint-disable no-case-declarations */
/**
 * INITIAL STATE
 */
const initialState = {
  // isPlaying should be false, but for testing purposes leave as true
  isPlaying: false,
  playerName: '',
  score: 0,
  playersKilled: [],
  gameStartTime: null,
  duration: null
};

/**
 * ACTION TYPES
 */
const START_GAME = 'START_GAME';
const STOP_GAME = 'STOP_GAME'; //make player leave the gameView
const GAME_OVER = 'GAME_OVER'; //player was killed, calculate duration
const CALCULATE_SCORE = 'CALCULATE_SCORE';
const KILLED_PLAYER = 'KILLED_PLAYER';

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
  gameOver: () => ({
    type: GAME_OVER
  }),
  calculateScore: (tileMap, harborIndex) => ({
    type: CALCULATE_SCORE,
    tileMap,
    harborIndex
  }),
  killedPlayer: name => ({
    type: KILLED_PLAYER,
    name
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
        playerName: action.name,
        gameStartTime: new Date()
      };
    case STOP_GAME:
      // transition player away from the gameView component to the welcome one again
      return {
        ...state,
        isPlaying: false
      };
    case GAME_OVER:
      let endTime = new Date();
      return {
        ...state,
        duration: Math.floor((endTime - state.gameStartTime) / 1000) //get duration in seconds
      };
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
    case KILLED_PLAYER:
      return {
        ...state,
        playersKilled: [...state.playersKilled, name]
      };
    default:
      return state;
  }
}
