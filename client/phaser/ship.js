import Phaser from 'phaser';

export default class Ship {
  constructor(scene, x, y) {
    this.scene = scene;
    this.absVelocity = 200;
    this.direction = 1; //positive is down and right, negative is up and left

    // set the type of tile the cart was at and is at to be the same value initially
    this.prevCartTile = this.scene.layer.getTileAtWorldXY(x, y).index;
    this.nextCartTile = this.prevCartTile;
    this.exitPoint = null;
    this.entryPoint = null;

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
      .setSize(50, 50)
      .setOffset(0, 0);

    this.sprite.body.setAllowGravity(false);
    // ** doesnt seem to do anything T_T
    // this.sprite.body.collideWorldBounds = true;

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

    // ******************Movement Logic******************
    if (keys.left.isDown) {
      this.direction = -1;
      sprite.body.setVelocity(this.absVelocity * this.direction, 0);
      sprite.anims.play('ship-west');
    } else if (keys.up.isDown) {
      this.direction = -1;
      sprite.body.setVelocity(0, this.absVelocity * this.direction);
      sprite.anims.play('ship-north');
    } else if (keys.right.isDown) {
      this.direction = 1;
      sprite.body.setVelocity(this.absVelocity * this.direction, 0);
      sprite.anims.play('ship-east');
    } else if (keys.down.isDown) {
      this.direction = 1;
      sprite.body.setVelocity(0, this.absVelocity * this.direction);
      sprite.anims.play('ship-south');
    }

    // // ******************Path Logic******************
    // // get the tile at the location of the ship
    // let tile = this.scene.layer.putTileAtWorldXY(
    //   this.scene.tileValues.pathTile,
    //   this.sprite.x,
    //   this.sprite.y
    // );
    // this.setPath();

    // *************************************************
  }

  setPath() {
    // ******************Path Logic******************

    this.prevCartTile = this.nextCartTile;
    this.nextCartTile = this.scene.layer.getTileAtWorldXY(
      this.sprite.x,
      this.sprite.y
    );

    console.log(this.nextCartTile);

    // If the user is moving from harbor to sea, then we must set the exit point
    // if (
    //   this.prevCartTile === this.scene.tileValues.harborTile &&
    //   this.nextCartTile === this.scene.tileValues.regularTile
    // ) {
    //   console.log('setting exit point');
    //   this.exitPoint = {
    //     x: this.sprite.x,
    //     y: this.sprite.y
    //   };
    // } else if (
    //   this.prevCartTile === this.scene.tileValues.regularTile &&
    //   this.nextCartTile === this.scene.tileValues.harborTile
    // ) {
    //   console.log('setting entry point');
    //   // If the user is moving from sea to harbor, then we must set the entry point
    //   this.entryPoint = {
    //     x: this.sprite.x,
    //     y: this.sprite.y
    //   };
    // }

    // if (this.entryPoint && this.exitPoint) {
    //   console.log('set both!! exit:', this.exitPoint, 'entry', this.entryPoint);
    // }

    // get the tile at the location of the ship
    let tile = this.scene.layer.putTileAtWorldXY(
      this.scene.tileValues.pathTile,
      this.sprite.x,
      this.sprite.y
    );
  }
}
