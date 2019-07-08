import Phaser from 'phaser';

export default class Opponent {
  constructor(scene, x, y, direction) {
    // keep track of the direction they're facing
    this.direction = direction;

    // Opponent's starting location
    this.sprite = scene.physics.add
      .sprite(x, y, 'ship', 0)
      // .setDrag(1000, 0)
      .setSize(50, 50)
      .setOffset(0, 0);

    this.sprite.body.setAllowGravity(false);

    // create animation
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
  }

  update() {
    if (this.direction === 'north') {
      this.sprite.anims.play('ship-north');
    } else if (this.direction === 'west') {
      this.sprite.anims.play('ship-west');
    } else if (this.direction === 'east') {
      this.sprite.anims.play('ship-east');
    } else if (this.direction === 'south') {
      this.sprite.anims.play('ship-south');
    }
  }
  destroy() {
    this.sprite.destroy();
  }
  move(x, y, direction) {
    // this.sprite.x = x;
    // this.sprite.y = y;
    this.sprite.setPosition(x, y);

    this.direction = direction;
  }
}
