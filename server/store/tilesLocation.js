/* eslint-disable no-case-declarations */
const {getTileIndices} = require('../game/utils');

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
  tileValues: getTileIndices(),
  rooms: {}, //the keys will be the roomIds and the value will be an object with a tilemap property which will have present and precious values, and a tilemapdiff property
  regularIndex: null,
  tileMapRowLength: null //number
};

/**
 * ACTION CREATORS
 */
const tilesActionCreators = {
  initTileMap: (tileMap, tileMapRowLength, roomId, regularIndex) => ({
    type: INIT_TILEMAP,
    tileMap,
    tileMapRowLength,
    roomId,
    regularIndex
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
              previous: [...action.tileMap],
              present: [...action.tileMap]
            },
            tileMapDiff: []
          }
        },
        regularIndex: action.regularIndex
      };
    case UPDATE_TILEMAP:
      // console.log('****current tilemap');
      // printTileMap(state.tileMap.present, state.tileMapRowLength);
      let filteredTileMapDiff = state.rooms[action.roomId].tileMapDiff.filter(
        ({tileInd}) => {
          for (let i = 0; i < action.tileMapDiff.length; ++i) {
            if (action.tileMapDiff[i].tileInd === tileInd) {
              // if the tileMapDiff from the client has changes for the same tile the server has a in its tilemapDiff, we want to filer it out so were not sending multiple changes for the same tile
              return false;
            }
          }
        }
      );
      let tileMapCopy = [...state.rooms[action.roomId].tileMap.present];
      // for all the reported changes from the client set them in our tilemap
      //tileInd is position in array
      //tileIndex is the color of the tile
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
            tileMapDiff: [...filteredTileMapDiff, ...action.tileMapDiff]
          }
        }
      };
    case RESET_TILEMAP_DIFF:
      const currentTileMap = [...state.rooms[action.roomId].tileMap.present];
      const tileMapDiffCopy = currentTileMap.reduce(
        (tileMapDiffAccum, tileIndex, tileInd) => {
          if (
            state.tileValues.path.includes(tileIndex) ||
            state.tileValues.harbor.includes(tileIndex)
          ) {
            return tileMapDiffAccum.push({tileInd, tileIndex});
          }
        },
        []
      );

      return {
        ...state,
        rooms: {
          ...state.rooms,
          [action.roomId]: {
            ...state.rooms[action.roomId],
            tileMapDiff: [...tileMapCopy]
          }
        }
      };
    case REMOVE_PLAYERS_TILES:
      // when a player is killed or leaves the game we need to revert their tiles
      let newTileMap = [];
      let newTileMapDiff = [...state.rooms[action.roomId].tileMapDiff];

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
