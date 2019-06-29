const {createStore, combineReducers, applyMiddleware} = require('redux');
const {createLogger} = require('redux-logger');
const thunkMiddleware = require('redux-thunk');
const {composeWithDevTools} = require('redux-devtools-extension');
const tilesReducer = require('./tilesLocation');

const reducer = combineReducers({tilesReducer});
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
);
const serverStore = createStore(reducer, middleware);

module.exports = serverStore;
