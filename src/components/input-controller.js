import Phaser from "phaser";

export class InputController {
  constructor(scene) {
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.zKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.xKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
  }

  update(player) {
    if (player.isAttacking) return;
    if (player.isDead) return;
  
    if (this.handleAttack(player)) return;
    if (this.handleBlink(player)) return;
  
    this.handleMovement(player);
    this.handleJump(player);
  }
  
  handleAttack(player) {
    if (Phaser.Input.Keyboard.JustDown(this.zKey)) {
      player.playerAttack();
      return true;
    }
    return false;
  }
  
  handleBlink(player) {
    if (Phaser.Input.Keyboard.JustDown(this.xKey)) {
      player.playerBlink();
      return true;
    }
    return false;
  }
  
  handleMovement(player) {
    const { left, right } = this.cursors;
  
    if (left.isDown) {
      player.leftBound();
    } else if (right.isDown) {
      player.rightBound()
    } else {
      player.playerIdle();
    }
  }
  
  handleJump(player) {
    if (this.cursors.up.isDown && player.body.blocked.down) {
      player.playerJump();
    }
  }
}
