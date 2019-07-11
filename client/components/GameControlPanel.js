import React from 'react';
import {connect} from 'react-redux';
import {gameStateActionCreators} from '../store/gameState';
import serverActionCreators from '.../server/store/index';
import socket from '../socket/index';

const GameControlPanel = props => {
  const {leave} = props;
  return (
    <div style={{position: 'absolute', zIndex: 1, right: '10px', top: '10px'}}>
      <div className="card-content white-text">
        <button className="btn-floating" onClick={() => leave(socket.id)}>
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
  leave: socketId => {
    dispatch(gameStateActionCreators.stopGame());
    dispatch(serverActionCreators.players.removedPlayer(socketId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(GameControlPanel);
