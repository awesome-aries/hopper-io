import React from 'react';
import {connect} from 'react-redux';
import {gameStateActionCreators} from '../store/gameState';

const GameControlPanel = props => {
  const {isPlaying, leave} = props;
  return (
    <div style={{position: 'absolute', zIndex: 1, right: '10px', top: '10px'}}>
      <div className="card-content white-text">
        <button className="btn-floating" onClick={leave}>
          <i className="material-icons">exit_to_app</i>
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  isPlaying: state.gameState.isPlaying
});

const mapDispatchToProps = dispatch => ({
  leave: () => {
    dispatch(gameStateActionCreators.stopGame());
    // socket.emit('player left game event');
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(GameControlPanel);
