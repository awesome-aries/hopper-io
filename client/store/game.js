/**
 * ACTION TYPES
 */

const SET_TILEMAP = 'SET_TILEMAP';
const SET_USER_XY = 'SET_USER_XY';

/**
 * INITIAL STATE
 */

const initialState = {
  tileMap: {},
  userWorldXY: {}, //{x, y} (in pixels)
  userXY: {} //{x, y} (in coords)
};

/**
 * ACTION CREATORS
 */

export const setTilemap = tileMap => ({
  type: SET_TILEMAP,
  tileMap
});

export const setUserXY = coords => ({
  type: SET_USER_XY,
  coords //{x, y}
});

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case SET_TILEMAP:
      return {
        ...state,
        tileMap: action.tileMap
      };
    case SET_USER_XY:
      return {
        ...state,
        userXY: action.coords
      };
    default:
      return state;
  }
}
