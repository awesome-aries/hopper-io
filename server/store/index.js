const {createStore, combineReducers, applyMiddleware} = require('redux');
const {createLogger} = require('redux-logger');
const thunkMiddleware = require('redux-thunk');
const {composeWithDevTools} = require('redux-devtools-extension');
const {tilesReducer, tilesActionTypes} = require('./tilesLocation');

const reducer = combineReducers({tilesReducer});
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
  tiles: tilesActionTypes
};

module.exports = {
  serverStore,
  serverActionTypes
};
