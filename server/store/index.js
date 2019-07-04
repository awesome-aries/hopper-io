const {createStore, combineReducers, applyMiddleware} = require('redux');
const {createLogger} = require('redux-logger');
const thunkMiddleware = require('redux-thunk').default;
const {tilesReducer, tilesActionCreators} = require('./tilesLocation');
const {playersReducer, playersActionCreators} = require('./player');

const reducer = combineReducers({tiles: tilesReducer, players: playersReducer});

const serverStore = createStore(
  reducer,
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
);

const serverActionCreators = {
  tiles: tilesActionCreators,
  players: playersActionCreators
};

module.exports = {
  serverStore,
  serverActionCreators
};
