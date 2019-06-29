/**
 * ACTION TYPES
 */

export const playersActionTypes = {
  SET_PLAYER_XY: 'SET_PLAYER_XY',
  MOVE_PLAYER: 'MOVE_PLAYER',
  SET_EXIT_POINT: 'SET_EXIT_POINT',
  SET_ENTRY_POINT: 'SET_ENTRY_POINT',
  CLEAR_EXIT_ENTRY: 'CLEAR_EXIT_ENTRY'
};

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
  harborEntryPoint: null,
  harborExitPoint: null
};

/**
 * ACTION CREATORS
 */

export const moveShip = (newX, newY) => ({
  type: playersActionTypes.MOVE_PLAYER,
  newX,
  newY
});

export const setPlayerXY = (x, y) => ({
  type: playersActionTypes.SET_PLAYER_XY,
  x,
  y
});

export const setExitPoint = (x, y) => ({
  type: playersActionTypes.SET_EXIT_POINT,
  x,
  y
});

export const setEntryPoint = (x, y) => ({
  type: playersActionTypes.SET_ENTRY_POINT,
  x,
  y
});

export const clearExitEntry = () => ({
  type: playersActionTypes.CLEAR_EXIT_ENTRY
});

/**
 * THUNK CREATORS
 */

/**
 * REDUCER
 */
export default function playersReducer(state = initialState, action) {
  switch (action.type) {
    case playersActionTypes.SET_PLAYER_XY:
      return {
        ...state,
        playerXY: {
          previous: state.playerXY.present,
          present: {
            x: action.x,
            y: action.y
          }
        }
      };
    case playersActionTypes.MOVE_PLAYER:
      return {
        ...state,
        playerXY: {
          previous: state.playerXY.present,
          present: {
            x: action.newX,
            y: action.newY
          }
        }
      };
    case playersActionTypes.SET_ENTRY_POINT:
      return {
        ...state,
        harborEntryPoint: {
          x: action.x,
          y: action.y
        }
      };
    case playersActionTypes.SET_EXIT_POINT:
      return {
        ...state,
        harborExitPoint: {
          x: action.x,
          y: action.y
        }
      };
    case playersActionTypes.CLEAR_EXIT_ENTRY:
      return {
        ...state,
        harborEntryPoint: null,
        harborExitPoint: null
      };
    default:
      return state;
  }
}
