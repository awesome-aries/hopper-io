/*
import React, {Component} from 'react';
import {connect} from 'react-redux';

import Welcome from './Welcome';
import GameView from './GameView';

class App extends Component {
  render() {
    const {isPlaying} = this.props;
    return (
      <div>
        {!isPlaying && <Welcome />}
        {isPlaying && <GameView />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isPlaying: state.reducer.isPlaying
});

const mapDispatchToProps = dispatch => ({
  // thunk: () => dispatch(thunk())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
*/
