/* eslint-disable no-case-declarations */
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

function printTileMap(tileMap, rowLength) {
  let row = '';
  tileMap.forEach((tile, i) => {
    if ((i + 1) % rowLength === 0) {
      row += ' ' + tile + ' ';
      console.log(row);
      row = '';
    } else {
      row += ' ' + tile + ' ';
    }
  });
}
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
      console.log('****current tilemap');
      printTileMap(state.tileMap.present, state.tileMapRowLength);
      // eslint-disable-next-line no-case-declarations
      let tileMapCopy = [...state.tileMap.present];
      // for all the reported changes from the client set them in our tilemap
      action.tileMapDiff.forEach(({tileInd, tileIndex}) => {
        tileMapCopy[tileInd] = tileIndex;
      });
      console.log('****new tilemap');
      printTileMap(tileMapCopy, state.tileMapRowLength);
      return {
        ...state,
        tileMap: {
          previous: [...state.tileMap.present],
          present: tileMapCopy
        }
      };
    case REMOVE_PLAYERS_TILES:
      // when a player is killed or leaves the game we need to revert their tiles
      console.log(
        '*******removing*********:',
        action.harborIndex,
        '&',
        action.pathIndex
      );
      let newTileMap = ['test'];
      printTileMap(state.tileMap.present, state.tileMapRowLength);
      // only need to remove tiles if the player wasnt killed
      if (action.harborIndex) {
        newTileMap = state.tileMap.present.map(tileIndex => {
          if (
            tileIndex === action.harborIndex ||
            tileIndex === action.pathIndex
          ) {
            return action.regularIndex;
          } else {
            return tileIndex;
          }
        });
      } else {
        newTileMap = [...state.tileMap.present];
      }
      console.log('vvvvvvvvvvvvremovedvvvvvvvvvvvv');
      printTileMap(newTileMap, state.tileMapRowLength);
      return {
        ...state,
        tileMap: {
          previous: [...state.tileMap.present],
          present: newTileMap
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
