import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router} from 'react-router-dom'
import history from './history'
import store from './store'
import App from './app'

// Now, every component that is interested in using Firebase has access to the Firebase instance with a FirebaseContext.Consumer component
import Firebase, {FirebaseContext} from './components/Firebase'

// establishes socket connection
import './socket'

ReactDOM.render(
  <Provider store={store}>
    <FirebaseContext.Provider value={new Firebase()}>
      <Router history={history}>
        <App />
      </Router>
    </FirebaseContext.Provider>,
  </Provider>,
  document.getElementById('app')
)
