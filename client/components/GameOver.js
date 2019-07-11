import React from 'react';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import {gameStateActionCreators} from '../store/gameState';

const GameOver = props => {
  const {stopGame, duration, score} = props;
  return (
    <div id="game-over-container">
      <div className="split left">
        <div id="gh-image" className="centered">
          <img
            src="/images/disappointedGH.png"
            alt="game-over"
            // height="100px"
            // width="100px"
            // style={{"max-height: 100px, max-width: 100px"}}
          />
        </div>
      </div>

      <div className="split right">
        <div className="centered">
          <div id="game-stats">
            <h1 className="game-over-list">Your Score: {score}</h1>
            <h1 className="game-over-list">Time Played: {duration} sec</h1>
          </div>

          <div id="play-again-button">
            <Button
              variant="contained"
              color="secondary"
              className="control-panel-button"
              onClick={stopGame}
              style={{fontSize: '27px'}}
            >
              Play Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  duration: state.gameState.duration,
  score: state.gameState.score
});

const mapDispatchToProps = dispatch => ({
  stopGame: () => {
    dispatch(gameStateActionCreators.stopGame());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(GameOver);
