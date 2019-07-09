const Tile = require('../game/tile');
const {getTileIndices} = require('../game/utils');

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
  tileMap: {
    previous: [], //need to keep track of the previous state of the tileMap
    present: []
  },
  tileMapDiff: [], //array of changes from the client
  tileMapRowLength: null, //number
  //these are all tile values
  tileValues: getTileIndices() //get tile values from tiled exported json
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
  }),
  resetTileMapDiff: () => ({
    type: RESET_TILEMAP_DIFF
  })
};
/**
 * THUNK CREATORS
 */

function printTileMap(tileMap, rowLength) {
  let row = '';
  tileMap.forEach((tile, i) => {
    if ((i + 1) % rowLength === 0) {
      row += ' ' + tile.present.color + ' ';
      console.log(row);
      row = '';
    } else {
      row += ' ' + tile.present.color + ' ';
    }
  });
}
/**
 * REDUCER
 */
function tilesReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_TILEMAP:
      let copyTileMap = action.tileMap.map((tileValue, ind) => {
        let tileType;
        if (state.tileValues.path.includes(tileValue)) {
          tileType = 'path';
        } else if (state.tileValues.harbor.includes(tileValue)) {
          tileType = 'harbor';
        } else {
          tileType = 'regular';
        }
        return new Tile(tileValue, tileType, ind);
      });
      return {
        ...state,
        tileMapRowLength: action.tileMapRowLength,
        tileMap: {
          present: copyTileMap,
          previous: state.tileMap.present
        }
      };
    case UPDATE_TILEMAP:
      // console.log('****current tilemap');
      // printTileMap(state.tileMap.present, state.tileMapRowLength);
      let tileMapCopy = [...state.tileMap.present];
      // for all the reported changes from the client set them in our tilemap
      action.tileMapDiff.forEach(({tileInd, tileIndex}) => {
        let tileType;
        if (state.tileValues.path.includes(tileIndex)) {
          tileType = 'path';
        } else if (state.tileValues.harbor.includes(tileIndex)) {
          tileType = 'harbor';
        } else {
          tileType = 'regular';
        }
        let currentTile = tileMapCopy[tileInd];
        currentTile.tileChange(tileIndex, tileType);
      });
      // console.log('****new tilemap');
      // printTileMap(tileMapCopy, state.tileMapRowLength);
      return {
        ...state,
        tileMap: {
          previous: [...state.tileMap.present],
          present: tileMapCopy
        },
        tileMapDiff: [...state.tileMapDiff, ...action.tileMapDiff]
      };
    case RESET_TILEMAP_DIFF:
      return {
        ...state,
        tileMapDiff: []
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
      let newTileMap = [...state.tileMap.present];
      let newTileMapDiff = [...state.tileMapDiff];
      printTileMap(state.tileMap.present, state.tileMapRowLength);
      // to check for the case where the player was killed then closed the browser
      if (action.harborIndex) {
        newTileMap.map((tile, ind) => {
          // if (tileIndex === action.harborIndex) {
          //   newTileMapDiff.push({tileInd: ind, tileIndex: action.regularIndex});
          //   // for the players harbor tiles, we revert themback to regular tiles
          //   newTileMap.push(action.regularIndex);
          // } else if (tileIndex === action.pathIndex) {
          //   newTileMapDiff.push({tileInd: ind, tileIndex: action.regularIndex});
          //   // for their path tiles, we want to revert it back to the previous value to  make sure if they are cutting into an opponents harbor that harbor is restored
          //   // return state.tileMap.previous[ind];
          //   newTileMap.push(action.regularIndex);
          // } else {
          //   newTileMap.push(tileIndex);
          // }
          let oldTileIndex = tile.present.color;
          tile.playerCleared(
            action.harborIndex,
            action.pathIndex,
            action.regularIndex
          );
          let newTileIndex = tile.present.color;
          // check to see if the tile color changed, and if so add to tileMapDiff
          if (oldTileIndex !== newTileIndex) {
            newTileMapDiff.push({tileInd: ind, tileIndex: newTileIndex});
          }
        });
      } else {
        newTileMap = [...state.tileMap.present];
      }
      console.log('newTileMapDiff', newTileMapDiff);
      console.log('vvvvvvvvvvvvremovedvvvvvvvvvvvv');
      printTileMap(newTileMap, state.tileMapRowLength);
      return {
        ...state,
        tileMap: {
          previous: [...state.tileMap.present],
          present: newTileMap
        },
        tileMapDiff: [...state.tileMapDiff, ...newTileMapDiff]
      };
    default:
      return state;
  }
}

module.exports = {
  tilesReducer,
  tilesActionCreators
};
