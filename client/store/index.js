import {createStore, combineReducers, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import user from './user';
import axios from 'axios';
// import tilesReducer, {tilesActionTypes} from './tilesLocation';
import gameReducer, {gameActionTypes} from './game';

const reducer = combineReducers({
  user,
  game: gameReducer
});
const middleware = composeWithDevTools(
  applyMiddleware(
    thunkMiddleware.withExtraArgument({axios}),
    createLogger({collapsed: true})
  )
);

const clientStore = createStore(reducer, middleware);

// exporting our action types so it can be used in our phaser scene
export const clientActionTypes = {
  game: gameActionTypes
};

export default clientStore;
export * from './user';
