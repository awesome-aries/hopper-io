import Phaser from 'phaser';

export default class Opponent {
  constructor(scene, x, y, direction, socketId) {
    // keep track of the direction they're facing

    this.scene = scene;

    // Opponent's starting location
    this.sprite = this.scene.physics.add
      .sprite(x, y, 'ship', 0)
      .setSize(50, 50);

    // create animation
    const anims = this.scene.anims;
    anims.create({
      key: 'ship-north',
      frames: [{key: 'ship', frame: 0}],
      frameRate: 3,
      repeat: -1
    });

    anims.create({
      key: 'ship-east',
      frames: [{key: 'ship', frame: 1}],
      frameRate: 3,
      repeat: -1
    });
    anims.create({
      key: 'ship-south',
      frames: [{key: 'ship', frame: 2}],
      frameRate: 3,
      repeat: -1
    });
    anims.create({
      key: 'ship-west',
      frames: [{key: 'ship', frame: 3}],
      frameRate: 3,
      repeat: -1
    });

    // set these as properties on the sprite so its accessible in the game
    this.sprite.socketId = socketId;
    this.sprite.direction = direction;
    // this.sprite.move = this.move
  }

  update() {
    if (this.sprite.direction === 'north') {
      this.sprite.anims.play('ship-north');
    } else if (this.sprite.direction === 'west') {
      this.sprite.anims.play('ship-west');
    } else if (this.sprite.direction === 'east') {
      this.sprite.anims.play('ship-east');
    } else if (this.sprite.direction === 'south') {
      this.sprite.anims.play('ship-south');
    }
  }
  // destroy() {
  //   this.sprite.destroy();
  // }
  // move(x, y, direction) {
  //   console.log('move');
  //   console.log('this.sprite', this.sprite);
  //   // this.sprite.x = x;
  //   // this.sprite.y = y;
  //   this.sprite.setPosition(x, y);

  //   this.sprite.direction = direction;
  // }
}
