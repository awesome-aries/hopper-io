/* eslint-disable react/no-unused-state */
import React from 'react';
import Game from './Game';
import Ui from './Ui';

class GameView extends React.Component {
  render() {
    return (
      <Ui>
        <Game />
      </Ui>
    );
  }
}

export default GameView;
