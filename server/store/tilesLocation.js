/**
 * ACTION TYPES
 */

/**
 * INITIAL STATE
 */

const initialState = {
  tileMap: {
    previous: [], //need to keep track of the previous state of the tileMap
    present: []
  },
  tileMapRowLength: null //number
};

/**
 * ACTION CREATORS
 */
const tilesActionCreators = {};
/**
 * THUNK CREATORS
 */

/**
 * REDUCER
 */
function tilesReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

module.exports = {
  tilesReducer,
  tilesActionCreators
};
