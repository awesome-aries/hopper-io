/**
 * INITIAL STATE
 */

const initialState = []; //an array of opponent objects

/**
 * ACTION TYPES
 */

const ADD_OPPONENT = 'ADD_OPPONENT';
const REMOVE_OPPONENT = 'REMOVE_OPPONENT';
const INIT_OPPONENTS = 'INIT_OPPONENTS';
const UPDATE_OPPONENTS_POS = 'UPDATE_OPPONENTS_POS';

/**
 * ACTION CREATORS
 */
export const opponentActionCreators = {
  // when a new player joins this action will be dispatched to add them to the players store
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
  initOpponents: opponents => ({
    type: INIT_OPPONENTS,
    opponents
  }),
  // this will be dispatched everytime the server sends updates on other player's positions
  updateOpponentsPos: opponents => ({
    type: UPDATE_OPPONENTS_POS,
    opponents
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
    case INIT_OPPONENTS:
      return {};
    default:
      return state;
  }
}
