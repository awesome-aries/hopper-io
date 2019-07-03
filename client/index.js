import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import clientStore from './store';
import App from './app';
// import App from './components/App';

// establishes socket connection
import './socket';

ReactDOM.render(
  <Provider store={clientStore}>
    <App />
  </Provider>,
  document.getElementById('app')
);
