import React, {Component} from 'react';
import {connect} from 'react-redux';

import Welcome from './Welcome';
import GameView from './GameView';

class App extends Component {
  render() {
    return (
      <div>
        {!isPlaying && <Welcome />}
        {isPlaying && <GameView />}
      </div>
    );
  }
}
