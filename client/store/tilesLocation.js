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
  tileMapRowLength: null, //number
  // maybe dont need this, and just calc in phaser
  // shipWorldXY: {}, //{x, y} (in pixels)
  shipXY: {
    previous: {}, //{x, y} (in coords)
    present: {}
  }
};

/**
 * ACTION TYPES
 */

export const tilesActionTypes = {
  SET_TILEMAP: 'SET_TILEMAP',
  SET_SHIP_XY: 'SET_SHIP_XY',
  MOVE_SHIP: 'MOVE_SHIP',
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

export const setUShipXY = (x, y) => ({
  type: tilesActionTypes.SET_SHIP_XY,
  x,
  y
});

export const setTile = (tileX, tileY, tileIndex) => ({
  // change the value of the tile index at the specified location
  type: tilesActionTypes.SET_TILE,
  x: tileX,
  y: tileY,
  tileIndex //the tile index aka the type of tile
});

export const moveShip = (newX, newY) => ({
  type: tilesActionTypes.MOVE_SHIP,
  newX,
  newY
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
    case tilesActionTypes.SET_SHIP_XY:
      return {
        ...state,
        shipXY: {
          previous: state.shipXY.present,
          present: {
            x: action.x,
            y: action.y
          }
        }
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
    case tilesActionTypes.MOVE_SHIP:
      return {
        ...state,
        shipXY: {
          previous: state.shipXY.present,
          present: {
            x: action.newX,
            y: action.newY
          }
        }
      };
    default:
      return state;
  }
}
