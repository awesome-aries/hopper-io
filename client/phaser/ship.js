import Phaser from 'phaser';

export default class Ship {
  constructor(scene, x, y) {
    this.scene = scene;
    this.absVelocity = 300;
    this.direction = 1; //positive is down and right, negative is up and left

    const anims = scene.anims;
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

    this.sprite = scene.physics.add
      .sprite(x, y, 'ship', 0)
      // .setDrag(1000, 0)
      .setMaxVelocity(300, 400)
      .setSize(50, 50)
      .setOffset(0, 0)
      .setVelocity(0, 0);

    const {LEFT, RIGHT, UP, DOWN} = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      down: DOWN
    });
  }
  freeze() {
    this.sprite.body.moves = false;
  }

  update() {
    const {keys, sprite} = this;

    if (keys.left.isDown || keys.up.isDown) {
      this.direction = -1;
    } else {
      this.direction = 1;
    }
    if (keys.left.isDown || keys.right.isDown) {
      sprite.body.setVelocity(this.absVelocity * this.direction, 0);
    } else {
      sprite.body.setVelocity(0, this.absVelocity * this.direction);
    }
  }
}
