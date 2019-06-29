import {XYToInd, IndToXY} from '../../util/tileMapConversions';
/**
 * ACTION TYPES
 */

export const tilesActionTypes = {
  SET_TILEMAP: 'SET_TILEMAP',
  SET_SHIP_XY: 'SET_SHIP_XY',
  MOVE_SHIP: 'MOVE_SHIP'
};

/**
 * INITIAL STATE
 */

const initialState = {
  tileMap: [],
  tileMapRowLength: null, //number
  shipWorldXY: {}, //{x, y} (in pixels)
  shipXY: {} //{x, y} (in coords)
};

/**
 * ACTION CREATORS
 */

export const setTilemap = (tileMap, tileMapRowLength) => ({
  type: tilesActionTypes.SET_TILEMAP,
  tileMap,
  tileMapRowLength
});

export const setUShipXY = coords => ({
  type: tilesActionTypes.SET_SHIP_XY,
  coords //{x, y}
});

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case tilesActionTypes.SET_TILEMAP:
      return {
        ...state,
        tileMap: action.tileMap,
        tileMapRowLength: action.tileMapRowLength
      };
    case tilesActionTypes.SET_SHIP_XY:
      return {
        ...state,
        shipXY: action.coords
      };
    default:
      return state;
  }
}
