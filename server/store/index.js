const {createStore, combineReducers, applyMiddleware} = require('redux');
const {createLogger} = require('redux-logger');
const thunkMiddleware = require('redux-thunk').default;
const {composeWithDevTools} = require('redux-devtools-extension');
const {tilesReducer, tilesActionCreators} = require('./tilesLocation');
const {playersReducer, playersActionCreators} = require('./player');

const reducer = combineReducers({tilesReducer, playersReducer});
const composeEnhancers = composeWithDevTools({
  trace: true
});

const serverStore = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
  )
);

const serverActionTypes = {
  tiles: tilesActionCreators,
  players: playersActionCreators
};

module.exports = {
  serverStore,
  serverActionTypes
};
