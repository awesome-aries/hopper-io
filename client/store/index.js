import {createStore, combineReducers, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import user from './user';
import axios from 'axios';
import tilesReducer, {tilesActionTypes} from './tilesLocation';

const reducer = combineReducers({user, tilesReducer});
const middleware = composeWithDevTools(
  applyMiddleware(
    thunkMiddleware.withExtraArgument({axios}),
    createLogger({collapsed: true})
  )
);

const clientStore = createStore(reducer, middleware);

// exporting our action types so it can be used in our phaser scene
export const clientActionTypes = {
  tiles: tilesActionTypes
};

export default clientStore;
export * from './user';
