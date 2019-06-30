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

const composeEnhancers = composeWithDevTools({
  trace: true,
  traceLimit: 25
});

const clientStore = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware.withExtraArgument({axios}),
      createLogger({collapsed: true})
    )
  )
);

// exporting our action types so it can be used in our phaser scene
export const clientActionTypes = {
  game: gameActionTypes
};

export default clientStore;
export * from './user';
