/* eslint-disable no-case-declarations */
/**
 * ACTION TYPES
 */

const INIT_TILEMAP = 'INIT_TILEMAP';
const UPDATE_TILEMAP = 'UPDATE_TILEMAP';
const REMOVE_PLAYERS_TILES = 'REMOVE_PLAYERS_TILES';
const RESET_TILEMAP_DIFF = 'RESET_TILEMAP_DIFF';

/**
 * INITIAL STATE
 */

const initialState = {
  // tileMap: {
  //   previous: [], //need to keep track of the previous state of the tileMap
  //   present: []
  // },
  rooms: {}, //the keys will be the roomIds and the value will be an object with a tilemap property which will have present and precious values, and a tilemapdiff property
  // tileMapDiff: [], //array of changes from the client
  tileMapRowLength: null //number
};

/**
 * ACTION CREATORS
 */
const tilesActionCreators = {
  initTileMap: (tileMap, tileMapRowLength, roomId) => ({
    type: INIT_TILEMAP,
    tileMap,
    tileMapRowLength,
    roomId
  }),
  updateTileMap: (tileMapDiff, roomId) => ({
    type: UPDATE_TILEMAP,
    tileMapDiff,
    roomId
  }),
  removePlayersTiles: (pathIndex, harborIndex, regularIndex, roomId) => ({
    type: REMOVE_PLAYERS_TILES,
    harborIndex,
    pathIndex,
    regularIndex,
    roomId
  }),
  resetTileMapDiff: roomId => ({
    type: RESET_TILEMAP_DIFF,
    roomId
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
        rooms: {
          ...state.rooms,
          [action.roomId]: {
            tileMap: {
              previous: [...state.rooms[action.roomId].tileMap.present],
              present: [...action.tileMap]
            },
            tileMapDiff: []
          }
        }
      };
    case UPDATE_TILEMAP:
      // console.log('****current tilemap');
      // printTileMap(state.tileMap.present, state.tileMapRowLength);
      let tileMapCopy = [...state.rooms[action.roomId].tileMap.present];
      // for all the reported changes from the client set them in our tilemap
      action.tileMapDiff.forEach(({tileInd, tileIndex}) => {
        tileMapCopy[tileInd] = tileIndex;
      });
      // console.log('****new tilemap');
      // printTileMap(tileMapCopy, state.tileMapRowLength);
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [action.roomId]: {
            tileMap: {
              previous: [...state.rooms[action.roomId].tileMap.present],
              present: tileMapCopy
            },
            tileMapDiff: [
              ...state.rooms[action.roomId].tileMapDiff,
              ...action.tileMapDiff
            ]
          }
        }
      };
    case RESET_TILEMAP_DIFF:
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [action.roomId]: {
            ...state.rooms[action.roomId],
            tileMapDiff: []
          }
        }
      };
    case REMOVE_PLAYERS_TILES:
      // when a player is killed or leaves the game we need to revert their tiles
      console.log(
        '*******removing*********:',
        action.harborIndex,
        '&',
        action.pathIndex,
        'changing to:',
        action.regularIndex
      );
      let newTileMap = [];
      let newTileMapDiff = [...state.rooms[action.roomId].tileMapDiff];
      printTileMap(state.tileMap.present, state.tileMapRowLength);
      // only need to remove tiles if the player wasnt killed
      if (action.harborIndex) {
        state.rooms[action.roomId].tileMap.present.forEach((tileIndex, ind) => {
          if (tileIndex === action.harborIndex) {
            newTileMapDiff.push({tileInd: ind, tileIndex: action.regularIndex});
            // for the players harbor tiles, we revert themback to regular tiles
            newTileMap.push(action.regularIndex);
          } else if (tileIndex === action.pathIndex) {
            newTileMapDiff.push({tileInd: ind, tileIndex: action.regularIndex});
            // for their path tiles, we want to revert it back to the previous value to  make sure if they are cutting into an opponents harbor that harbor is restored
            // return state.tileMap.previous[ind];
            newTileMap.push(action.regularIndex);
          } else {
            newTileMap.push(tileIndex);
          }
        });
      } else {
        newTileMap = [...state.rooms[action.roomId].tileMap.present];
      }
      console.log('newTileMapDiff', newTileMapDiff);
      console.log('vvvvvvvvvvvvremovedvvvvvvvvvvvv');
      printTileMap(newTileMap, state.tileMapRowLength);
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [action.roomId]: {
            tileMap: {
              previous: [...state.rooms[action.roomId].tileMap.present],
              present: newTileMap
            },
            tileMapDiff: [
              ...state.rooms[action.roomId].tileMapDiff,
              ...newTileMapDiff
            ]
          }
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
