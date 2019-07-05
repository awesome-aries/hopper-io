/**
 * ACTION TYPES
 */

const INIT_TILEMAP = 'INIT_TILEMAP';
const UPDATE_TILEMAP = 'UPDATE_TILEMAP';
const REMOVE_PLAYERS_TILES = 'REMOVE_PLAYERS_TILES';

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
  }),
  removePlayersTiles: (pathIndex, harborIndex, regularIndex) => ({
    type: REMOVE_PLAYERS_TILES,
    harborIndex,
    pathIndex,
    regularIndex
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
    case REMOVE_PLAYERS_TILES:
      // when a player is killed or leaves the game we need to revert their tiles
      return {
        ...state,
        tileMap: {
          previous: [...state.tileMap.present],
          present: state.tileMap.present.map(tileIndex => {
            if (
              tileIndex === action.harborIndex ||
              tileIndex === action.pathIndex
            ) {
              return action.regularIndex;
            } else {
              return tileIndex;
            }
          })
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
