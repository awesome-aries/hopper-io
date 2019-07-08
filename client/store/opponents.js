/**
 * INITIAL STATE
 */

const initialState = []; //an array of opponent objects

/**
 * ACTION TYPES
 */

const ADD_OPPONENT = 'ADD_OPPONENT';
const REMOVE_OPPONENT = 'REMOVE_OPPONENT';
const SET_OPPONENTS = 'SET_OPPONENTS';
const FILTER_OPPONENTS = 'FILTER_OPPONENTS';

/**
 * ACTION CREATORS
 */
export const opponentActionCreators = {
  // when a new player joins this action will be dispatched to add current player to all other players store
  addOpponent: opponent => ({
    type: ADD_OPPONENT,
    opponent
  }),
  // when a player leaves this action will be dispatched to remove them from the other players' store
  removeOpponent: opponentId => ({
    type: REMOVE_OPPONENT,
    opponentId
  }),
  // when the player starts the game, this will be dispatched to set all the other players currently in the game
  // also will be dispatched everytime the server sends updates on other player's positions
  setOpponents: opponents => ({
    type: SET_OPPONENTS,
    opponents
  }),
  filterOpponents: selfSocketId => ({
    type: FILTER_OPPONENTS,
    selfSocketId
  })
};

/**
 * THUNK CREATORS
 */

/**
 * REDUCER
 */

export default function opponentReducer(state = initialState, action) {
  switch (action.type) {
    case SET_OPPONENTS:
      return [...action.opponents];
    case ADD_OPPONENT:
      return [...state, action.opponent];
    case REMOVE_OPPONENT:
      return state.filter(opponent => opponent.socketId !== action.opponentId);
    case FILTER_OPPONENTS:
      return state.filter(
        opponent => opponent.socketId !== action.selfSocketId
      );
    default:
      return state;
  }
}
