/* eslint-disable no-case-declarations */
// IndToXY returns obj {x,y}
import {XYToInd, IndToXY} from '../../util/tileMapConversions';

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
 * ACTION TYPES
 */

export const tilesActionTypes = {
  SET_TILEMAP: 'SET_TILEMAP',
  SET_TILE: 'SET_TILE'
};

/**
 * ACTION CREATORS
 */

export const setTilemap = (tileMap, tileMapRowLength) => ({
  type: tilesActionTypes.SET_TILEMAP,
  tileMap,
  tileMapRowLength
});

export const setTile = (tileX, tileY, tileIndex) => ({
  // change the value of the tile index at the specified location
  type: tilesActionTypes.SET_TILE,
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
export default function(state = initialState, action) {
  switch (action.type) {
    case tilesActionTypes.SET_TILEMAP:
      return {
        ...state,
        tileMap: {
          // we want to track the previous state of the tile map, so store the present version in previous when updating the present one
          previous: state.tileMap.present,
          present: action.tileMap
        },
        tileMapRowLength: action.tileMapRowLength
      };

    case tilesActionTypes.SET_TILE:
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
