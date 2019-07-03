/**
 * INITIAL STATE
 */

const initialState = {
  isPlaying: false,
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
