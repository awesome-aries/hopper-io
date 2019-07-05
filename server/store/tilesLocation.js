/**
 * ACTION TYPES
 */

const INIT_TILEMAP = 'INIT_TILEMAP';
const UPDATE_TILEMAP = 'UPDATE_TILEMAP';

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
const tilesActionCreators = {
  initTileMap: (tileMap, tileMapRowLength) => ({
    type: INIT_TILEMAP,
    tileMap,
    tileMapRowLength
  }),
  updateTileMap: tileMapDiff => ({
    type: UPDATE_TILEMAP,
    tileMapDiff
  })
};
/**
 * THUNK CREATORS
 */

/**
 * REDUCER
 */
function tilesReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_TILEMAP:
      return {
        ...state,
        tileMapRowLength: action.tileMapRowLength,
        tileMap: {
          previous: [...state.tileMap.present],
          present: [...action.tileMap]
        }
      };
    case UPDATE_TILEMAP:
      // eslint-disable-next-line no-case-declarations
      let tileMapCopy = [...state.tileMap.present];
      // for all the reported changes from the client set them in our tilemap
      action.tileMapDiff.forEach(({tileInd, tileIndex}) => {
        tileMapCopy[tileInd] = tileIndex;
      });

      return {
        ...state,
        tileMap: {
          previous: [...state.tileMap.present],
          present: tileMapCopy
        }
      };
    default:
      return state;
  }
}

module.exports = {
  tilesReducer,
  tilesActionCreators
};
