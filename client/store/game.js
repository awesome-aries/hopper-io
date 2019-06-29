/* eslint-disable no-case-declarations */
// IndToXY returns obj {x,y}
import {XYToInd, IndToXY} from '../../util/tileMapConversions';

/**
 * INITIAL STATE
 */

const initialState = {
  // maybe dont need this, and just calc in phaser
  // shipWorldXY: {}, //{x, y} (in pixels)
  playerXY: {
    previous: {}, //{x, y} (in coords)
    present: {}
  },
  currentTileIdx: {
    previous: null,
    present: null
  },
  entryPoint: null,
  exitPoint: null,
  tileMap: {
    previous: [], //need to keep track of the previous state of the tileMap
    present: []
  },
  tileMapRowLength: null //number
};

/**
 * ACTION TYPES
 */

export const gameActionTypes = {
  SET_PLAYER_XY: 'SET_PLAYER_XY',
  MOVE_PLAYER: 'MOVE_PLAYER',
  SET_EXIT_POINT: 'SET_EXIT_POINT',
  SET_ENTRY_POINT: 'SET_ENTRY_POINT',
  CLEAR_EXIT_ENTRY: 'CLEAR_EXIT_ENTRY',
  SET_TILEMAP: 'SET_TILEMAP',
  SET_TILE: 'SET_TILE'
};

/**
 * ACTION CREATORS
 */

export const movePlayer = (newX, newY) => ({
  type: gameActionTypes.MOVE_PLAYER,
  newX,
  newY
});

export const setPlayerXY = (x, y) => ({
  type: gameActionTypes.SET_PLAYER_XY,
  x,
  y
});

export const setExitPoint = (x, y) => ({
  type: gameActionTypes.SET_EXIT_POINT,
  x,
  y
});

export const setEntryPoint = (x, y) => ({
  type: gameActionTypes.SET_ENTRY_POINT,
  x,
  y
});

export const clearExitEntry = () => ({
  type: gameActionTypes.CLEAR_EXIT_ENTRY
});

export const setTilemap = (tileMap, tileMapRowLength) => ({
  type: gameActionTypes.SET_TILEMAP,
  tileMap,
  tileMapRowLength
});

export const setTile = (tileX, tileY, tileIndex) => ({
  // change the value of the tile index at the specified location
  type: gameActionTypes.SET_TILE,
  x: tileX,
  y: tileY,
  tileIndex //the tile index aka the type of tile
});

/**
 * THUNK CREATORS
 */

/**
 * REDUCER
 */
export default function gameReducer(state = initialState, action) {
  switch (action.type) {
    case gameActionTypes.SET_PLAYER_XY:
      return {
        ...state,
        playerXY: {
          previous: {
            x: action.x,
            y: action.y
          },
          present: {
            x: action.x,
            y: action.y
          }
        },
        currentTileIdx: {
          previous: state.currentTileIdx.present,
          present: state.tileMap[XYToInd(action.x, action.y)]
        }
      };
    case gameActionTypes.MOVE_PLAYER:
      return {
        ...state,
        playerXY: {
          previous: state.playerXY.present,
          present: {
            x: action.newX,
            y: action.newY
          }
        },
        currentTileIdx: {
          previous: state.currentTileIdx.present,
          present: state.tileMap[XYToInd(action.newX, action.newY)]
        }
      };
    case gameActionTypes.SET_ENTRY_POINT:
      return {
        ...state,
        entryPoint: {
          x: action.x,
          y: action.y
        }
      };
    case gameActionTypes.SET_EXIT_POINT:
      return {
        ...state,
        exitPoint: {
          x: action.x,
          y: action.y
        }
      };
    case gameActionTypes.CLEAR_EXIT_ENTRY:
      return {
        ...state,
        entryPoint: null,
        exitPoint: null
      };
    case gameActionTypes.SET_TILEMAP:
      return {
        ...state,
        tileMap: {
          // we want to track the previous state of the tile map, so store the present version in previous when updating the present one
          previous: state.tileMap.present,
          present: action.tileMap
        },
        tileMapRowLength: action.tileMapRowLength
      };

    case gameActionTypes.SET_TILE:
      // corresponding index in tileMap
      let ind = XYToInd(action.x, action.y, state.tileMapRowLength);
      return {
        ...state,
        tileMap: {
          // save present in the previous
          previous: state.tileMap.present,
          // change the value for the correct ind
          present: state.tileMap.present.map((x, xInd) => {
            if (xInd === ind) {
              return action.tileIndex;
            } else {
              return x;
            }
          })
        }
      };
    default:
      return state;
  }
}
