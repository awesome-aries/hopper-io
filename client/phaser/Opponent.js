import Phaser from 'phaser';

export default class Opponent {
  constructor(scene, x, y, direction, socketId) {
    // keep track of the direction they're facing

    this.scene = scene;

    // Opponent's starting location
    this.sprite = this.scene.physics.add
      .sprite(x, y, 'ship', 0)
      .setSize(50, 50);

    // set these as properties on the sprite so its accessible in the game
    this.sprite.socketId = socketId;
    this.sprite.direction = direction;
    // this.sprite.move = this.move
  }
}
