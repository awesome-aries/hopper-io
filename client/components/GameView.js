/* eslint-disable react/no-unused-state */
import React from 'react';
import Game from './Game';
import Ui from './Ui';

class GameView extends React.Component {
  render() {
    return (
      <div>
        <Ui>
          <Game />
        </Ui>
      </div>
    );
  }
}

export default GameView;
