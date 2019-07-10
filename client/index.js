import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router} from 'react-router-dom';
import history from './history';
import clientStore from './store';
import App from './app';
// import App from './components/App';

// establishes socket connection
import './socket';

ReactDOM.render(
  <Provider store={clientStore}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
);
