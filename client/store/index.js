import {createStore, combineReducers, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import user from './user';
import axios from 'axios';
// import tilesReducer, {tilesActionTypes} from './tilesLocation';
import gameReducer, {gameActionCreators} from './game';
import opponentReducer, {opponentActionCreators} from './opponents';

const reducer = combineReducers({
  user,
  game: gameReducer,
  opponent: opponentReducer
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

// this has all our action creator methods
export const clientActionCreators = {
  game: gameActionCreators,
  opponent: opponentActionCreators
};

export default clientStore;
export * from './user';
