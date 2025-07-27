import { KeyboardController } from '@/components/input/controllers/keyboard-controller';
import { Idle } from '@/components/states/characters/player-states/states/idle';
import { Movement } from '@/components/states/characters/player-states/states/movement';
import { Casting } from '@/components/states/characters/player-states/states/casting';
import { Ready } from '@/components/states/characters/player-states/states/ready';
import { Death } from '@/components/states/characters/player-states/states/death';
import { Character, CharacterConfig } from '@/objects/characters/core/character';
import { SpellManager } from '@/managers/spell-manager';
import { UiManager } from '@/managers/ui-manager';
import { VELOCITY, SPELLS } from '@/utils/constants';

interface PlayerConfig extends CharacterConfig {
  spellManager: SpellManager;
  ui: UiManager;
}

export class Player extends Character {
  scene: Phaser.Scene;
  private controls!: KeyboardController;
  private spellManager: SpellManager;
  private maxHealth: number;
  private ui: UiManager;
  private isCasting = false;

  constructor({
    scene,
    position,
    keyName,
    frame,
    health,
    facingRight,
    spellManager,
    ui,
  }: PlayerConfig) {
    super({ scene, position, keyName, health, frame, facingRight });

    this.scene = scene;
    this.spellManager = spellManager;
    this.maxHealth = health;
    this.ui = ui;

    this.initKeyboard();
    this.initStateMachine();
    this.arcadeBody.setSize(20, 48);
  }

  private initKeyboard(): void {
    const keyboard = this.scene.input.keyboard;
    if (!keyboard) {
      throw new Error('Keyboard input not available yet.');
    }

    this.controls = new KeyboardController(keyboard);
  }

  private initStateMachine(): void {
    this.stateMachine.addState(new Idle(this, this.controls, this.spellManager));
    this.stateMachine.addState(new Movement(this, this.controls, this.spellManager));
    this.stateMachine.addState(new Casting(this, this.controls));
    this.stateMachine.addState(new Ready(this, this.controls, this.ui));
    this.stateMachine.addState(new Death(this));

    this.stateMachine.changeState('Idle');
  }

  update(): void {
    this.setVelocityX(0);
    this.stateMachine.update();
    this.controls.update();
  }

  moveLeft(): void {
    this.setVelocityX(VELOCITY.PLAYER_VELOCITY.MOVE * -1);
    this.setFlipX(true);
    this.facingRight = false;
    this.anims.play('left', true);
  }

  moveRight(): void {
    this.setVelocityX(VELOCITY.PLAYER_VELOCITY.MOVE);
    this.setFlipX(false);
    this.facingRight = true;
    this.anims.play('right', true);
  }

  jump(): void {
    if (this.arcadeBody.blocked.down) {
      this.setVelocityY(VELOCITY.PLAYER_VELOCITY.JUMP * -1);
    }
  }

  idle(): void {
    if (this.anims.currentAnim?.key !== 'idle') {
      this.anims.play('idle');
    }
  }

  primarySpell(): void {
    const duration = 800;

    this.isCasting = true;
    this.anims.play('simple-attack', true);

    this.ui.startCast(duration, () => {
      this.spellManager.castFireball();
      this.isCasting = false;
    });
  }

  secondarySpell(): void {
    this.spellManager.castBlink();
  }

  stopCasting(): void {
    this.isCasting = false;
    this.anims.stop();
    this.ui.stopCast();
  }

  takeDamage(amount: number): void {
    this.health -= amount;
    this.playHitEffect();

    this.ui.reducePlayerHealth(this.health, this.maxHealth);

    if (this.health <= 0) {
      this.die();
    }
  }

  hide(): void {
    this.arcadeBody.enable = false;
    this.setVisible(false);
  }

  show(): void {
    this.arcadeBody.enable = true;
    this.setVisible(true);
  }

  teleportTo(distance: number, direction: number): void {
    this.x = this.x + distance * direction;
  }

  getIsCasting(): boolean {
    return this.isCasting;
  }

  die(): void {
    if (this.isDead) return;

    this.isDead = true;
    this.arcadeBody.enable = false;
    this.controls.disable();

    this.anims.play('death', true);
    this.removeAllListeners();

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.setTexture('player', 101);
    });

    this.stateMachine.changeState('Death');
  }
}
