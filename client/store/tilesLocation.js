/**
 * ACTION TYPES
 */

export const tilesActionTypes = {
  SET_TILEMAP: 'SET_TILEMAP',
  SET_USER_XY: 'SET_USER_XY'
};

/**
 * INITIAL STATE
 */

const initialState = {
  tileMap: [],
  userWorldXY: {}, //{x, y} (in pixels)
  userXY: {} //{x, y} (in coords)
};

/**
 * ACTION CREATORS
 */

export const setTilemap = tileMap => ({
  type: tilesActionTypes.SET_TILEMAP,
  tileMap
});

export const setUserXY = coords => ({
  type: tilesActionTypes.SET_USER_XY,
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
        tileMap: action.tileMap
      };
    case tilesActionTypes.SET_USER_XY:
      return {
        ...state,
        userXY: action.coords
      };
    default:
      return state;
  }
}
