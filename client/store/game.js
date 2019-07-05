/* eslint-disable complexity */
/* eslint-disable no-case-declarations */
// IndToXY returns obj {x,y}
import {XYToInd, tileXYToWorldXY} from '../util/tileMapConversions';

/**
 * INITIAL STATE
 */

const initialState = {
  pathIndex: null, //get this from the server
  harborIndex: null,
  playerWorldXY: {
    previous: {}, //in phaser order
    present: {}
  }, //{x, y} (in pixels)
  playerXY: {
    previous: {}, //{x, y} (coords in javascript order)
    present: {}
  },
  playerPhaserXY: {
    previous: {}, //{x, y} (coords in phaser order)
    present: {}
  },
  direction: {
    previous: '',
    present: ''
  },
  currentTileIdx: {
    previous: null,
    present: null //initialize to harbor because player should always start on a harbor
  },
  entryPoint: null,
  exitPoint: null,
  tileMap: {
    previous: [], //need to keep track of the previous state of the tileMap
    present: []
  },
  tileMapDiff: [], //here we just need to track all the tiles that have changed since last receving the tilemap from the server
  // tileMapDiff is an arry holding objects {tileInd, tileIndex}
  tileMapRowLength: null //number
};

/**
 * ACTION TYPES
 */

const SET_PLAYER_XY = 'SET_PLAYER_XY';
const MOVE_PLAYER = 'MOVE_PLAYER';
const SET_EXIT_POINT = 'SET_EXIT_POINT';
const SET_ENTRY_POINT = 'SET_ENTRY_POINT';
const CLEAR_EXIT_ENTRY = 'CLEAR_EXIT_ENTRY';
const SET_TILEMAP = 'SET_TILEMAP';
const SET_TILE = 'SET_TILE';
const SET_TILES = 'SET_TILES';
const CHANGE_PATH_TO_HARBOR = 'CHANGE_PATH_TO_HARBOR';
const SET_TILE_VALUES = 'SET_TILE_VALUES';

/**
 * ACTION CREATORS
 */

export const gameActionCreators = {
  movePlayer: (x, y, direction) => ({
    type: MOVE_PLAYER,
    x,
    y,
    direction
  }),
  setPlayerXY: (x, y, direction) => ({
    type: SET_PLAYER_XY,
    x,
    y,
    direction
  }),
  setExitPoint: (x, y) => ({
    //we must switch phaser x and y for javascript (see tileMapConversions.js for detailed explanation)
    type: SET_EXIT_POINT,
    x,
    y
  }),
  setEntryPoint: (x, y) => ({
    //we must switch phaser x and y for javascript (see tileMapConversions.js for detailed explanation)
    type: SET_ENTRY_POINT,
    x,
    y
  }),
  clearExitEntry: () => ({
    type: CLEAR_EXIT_ENTRY
  }),
  setTilemap: (tileMap, tileMapRowLength) => ({
    type: SET_TILEMAP,
    tileMap,
    tileMapRowLength
  }),
  setTile: (tileX, tileY, tileIndex) => ({
    // change the value of the tile index at the specified location
    type: SET_TILE,
    y: tileY,
    x: tileX,
    tileIndex //the tile index aka the type of tile
  }),
  setTiles: (XYArray, tileIndex) => ({
    // change the value of the tiles of the corresponding indices
    type: SET_TILES,
    XYArray, //we must switch phaser x and y for javascript (see tileMapConversions.js for detailed explanation)
    tileIndex //the tile index aka the type of tile
  }),
  changePathToHarbor: () => ({
    type: CHANGE_PATH_TO_HARBOR
  }),
  setTileValues: (pathIndex, harborIndex) => ({
    type: SET_TILE_VALUES,
    pathIndex,
    harborIndex
  })
};

/**
 * THUNK CREATORS
 */

/**
 * REDUCER
 */
export default function gameReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PLAYER_XY:
      // this expects that the coords are passed in in phaser order
      let worldCoords = tileXYToWorldXY(action.x, action.y);
      return {
        ...state,
        playerXY: {
          previous: {...state.playerXY.present},
          present: {
            x: action.y,
            y: action.x
          }
        },
        playerPhaserXY: {
          previous: {...state.playerPhaserXY.present},
          present: {
            x: action.x,
            y: action.y
          }
        },
        playerWorldXY: {
          previous: {...state.playerWorldXY.present},
          present: {
            x: worldCoords.x,
            y: worldCoords.y
          }
        },
        direction: {
          previous: action.direction,
          present: action.direction
        },
        //we must switch phaser x and y for javascript (see tileMapConversions.js for detailed explanation)
        currentTileIdx: {
          previous:
            state.tileMap.present[
              XYToInd(action.y, action.x, state.tileMapRowLength)
            ], //initialize to be the same
          present:
            state.tileMap.present[
              XYToInd(action.y, action.x, state.tileMapRowLength)
            ]
        }
      };
    case MOVE_PLAYER:
      // for player position we keep them in phaser order so as to not mess up other calculations, but calculate current tile using javascript conventions
      let newWorldCoords = tileXYToWorldXY(action.x, action.y);
      return {
        ...state,
        playerXY: {
          previous: {...state.playerXY.present},
          present: {
            x: action.y,
            y: action.x
          }
        },
        playerPhaserXY: {
          previous: {...state.playerPhaserXY.present},
          present: {
            x: action.x,
            y: action.y
          }
        },
        playerWorldXY: {
          previous: {...state.playerWorldXY.present},
          present: {
            x: newWorldCoords.x,
            y: newWorldCoords.y
          }
        },
        direction: {
          previous: state.direction.present,
          present: action.direction
        },
        //we must switch phaser x and y for javascript (see tileMapConversions.js for detailed explanation)
        currentTileIdx: {
          previous: {...state.currentTileIdx}.present,
          present:
            state.tileMap.present[
              XYToInd(action.y, action.x, state.tileMapRowLength)
            ]
        }
      };
    case SET_ENTRY_POINT:
      return {
        ...state,
        entryPoint: {
          x: action.y,
          y: action.x
        }
      };
    case SET_EXIT_POINT:
      return {
        ...state,
        exitPoint: {
          x: action.y,
          y: action.x
        }
      };
    case CLEAR_EXIT_ENTRY:
      return {
        ...state,
        entryPoint: null,
        exitPoint: null
      };
    case SET_TILEMAP:
      // this is only called when we're receiving a new tilemap from the server, so we must set the tilemap and then clear the diff array
      return {
        ...state,
        tileMap: {
          // we want to track the previous state of the tile map, so store the present version in previous when updating the present one
          previous: [...state.tileMap.present],
          present: [...action.tileMap]
        },
        // reinitialize to be an empty array
        tileMapDiff: [],
        tileMapRowLength: action.tileMapRowLength
      };
    case SET_TILE:
      // corresponding index in tileMap
      let ind = XYToInd(+action.y, +action.x, state.tileMapRowLength);
      let playerInd = XYToInd(
        state.playerXY.present.y,
        state.playerXY.present.x,
        state.tileMapRowLength
      );
      return {
        ...state,
        tileMap: {
          // save present in the previous
          previous: [...state.tileMap.present],
          // change the value for the correct ind
          present: state.tileMap.present.map((x, xInd) => {
            if (xInd === ind) {
              return action.tileIndex;
            } else {
              return x;
            }
          })
        },
        // only update if the tile the player is on is being changed
        currentTileIdx: {
          previous:
            ind === playerInd
              ? {...state.currentTileIdx}.present
              : state.currentTileIdx.previous,
          present:
            ind === playerInd ? action.tileIndex : state.currentTileIdx.present
        },
        // mark the tile being set in the tilemap as a change
        tileMapDiff: [
          ...state.tileMapDiff,
          {tileInd: ind, tileIndex: action.tileIndex}
        ]
      };
    case SET_TILES:
      // convert all the x y to ind
      let inds = action.XYArray.map(coords => {
        return XYToInd(coords.y, coords.x, state.tileMapRowLength);
      });
      // make copy of tileMapDiff
      let newChanges = [...state.tileMapDiff];
      // make copy of the present tileMap
      let presentCopy = [...state.tileMap.present];
      inds.forEach(i => {
        // set new index value (tile type) for each tile specified in the copy
        presentCopy[i] = action.tileIndex;
        // and also record the changes
        newChanges.push({tileInd: i, tileIndex: action.tileIndex});
      });
      // check to see if a player is on a tile being changed
      let playerOnTile = inds.includes(
        XYToInd(
          state.playerXY.present.x,
          state.playerXY.present.y,
          state.tileMapRowLength
        )
      );
      return {
        ...state,
        tileMap: {
          previous: [...state.tileMap.present],
          present: presentCopy
        },
        tileMapDiff: newChanges,
        // only update if the tile the player is on is being changed
        currentTileIdx: {
          previous: playerOnTile
            ? {...state.currentTileIdx}.present
            : state.currentTileIdx.previous,
          present: playerOnTile
            ? action.tileIndex
            : state.currentTileIdx.present
        }
      };
    case CHANGE_PATH_TO_HARBOR:
      // make copy of tileMapDiff
      let newTileMapDiff = [...state.tileMapDiff];
      // make copy of the current tilemap
      let newTileMap = [...state.tileMap.present];
      newTileMap.forEach((tileVal, i) => {
        if (tileVal === state.pathIndex) {
          // change the value from path to harbor
          newTileMap[i] = state.harborIndex;
          // record the change
          newTileMapDiff.push({tileInd: i, tileIndex: state.harborIndex});
        }
      });
      return {
        ...state,
        tileMap: {
          previous: [...state.tileMap.present],
          present: newTileMap
        },
        tileMapDiff: newTileMapDiff
      };
    case SET_TILE_VALUES:
      return {
        ...state,
        pathIndex: action.pathIndex,
        harborIndex: action.harborIndex
      };
    default:
      return state;
  }
}
