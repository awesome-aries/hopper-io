import React from 'react';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import {gameStateActionCreators} from '../store/gameState';

class GameOver extends React.Component {
  render() {
    const {gameOver} = this.props;
    return (
      <div id="game-over-page">
        <div>
          <img src="/images/disappointedGH.png" alt="game-over" />
        </div>

        <Button
          variant="contained"
          color="primary"
          className="control-panel-button"
          onClick={gameOver}
        >
          Play Again
        </Button>
      </div>
    );
  }
}

// const mapStateToProps = state => ({
//   isPlaying: state.gameState.isPlaying
// });

const mapDispatchToProps = dispatch => ({
  gameOver: () => {
    dispatch(gameStateActionCreators.gameOver());
  }
});

export default connect(null, mapDispatchToProps)(GameOver);
