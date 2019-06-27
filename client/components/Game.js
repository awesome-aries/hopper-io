import React from 'react';
import Phaser from 'phaser';
import {StartingScene, PlayScene, LoseEndScene, WinEndScene} from '../phaser';

class Game extends React.Component {
  componentDidMount() {
    const config = {
      type: Phaser.AUTO,
      parent: 'phaser-game',
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {y: 0}, //because its a top down game, so no gravity
          debug: true
        }
      },
      scene: [StartingScene, PlayScene]
    };
    let game = new Phaser.Game(config);
  }
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return <div id="phaser-game" />;
  }
}
export default Game;
