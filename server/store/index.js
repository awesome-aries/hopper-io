const {createStore, combineReducers, applyMiddleware} = require('redux');
const {createLogger} = require('redux-logger');
const thunkMiddleware = require('redux-thunk').default;
const {composeWithDevTools} = require('redux-devtools-extension');
const {tilesReducer, tilesActionCreators} = require('./tilesLocation');
const {playersReducer, playersActionCreators} = require('./player');

const reducer = combineReducers({tiles: tilesReducer, players: playersReducer});
const composeEnhancers = composeWithDevTools({
  trace: true
});

const serverStore = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
  )
);

const serverActionCreators = {
  tiles: tilesActionCreators,
  players: playersActionCreators
};

module.exports = {
  serverStore,
  serverActionCreators
};
