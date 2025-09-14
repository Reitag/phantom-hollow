import { KeyboardController } from '@/components/input/controllers/keyboard-controller';
import { ServiceKeys, ServiceLocator } from '@/components/core/service-locator';
import { Idle } from '@/components/states/player-states/idle';
import { Movement } from '@/components/states/player-states/movement';
import { Casting } from '@/components/states/player-states/casting';
import { Ready } from '@/components/states/player-states/ready';
import { Death } from '@/components/states/core/death';
import { Movement as CharacterMovement } from '@/components/modules/movement';
import { CHARACTERS } from '@/constants/asset-keys';
import { PLAYER_ANIMATION } from '@/constants/animation-keys';
import { PLAYER_STATS } from '@/constants/object-stats';
import { Character, CharacterConfig } from '@/objects/core/character';
import { SpellManager } from '@/managers/spell-manager';
import { UiManager } from '@/managers/ui-manager';

interface PlayerConfig extends CharacterConfig {
  isValidTeleportPositionCallback: (x: number, y: number) => boolean;
}

export class Player extends Character {
  scene: Phaser.Scene;
  private controls!: KeyboardController;
  private spellManager: SpellManager;
  private ui: UiManager;
  private isValidTeleportPositionCallback: (x: number, y: number) => boolean;

  constructor({
    scene,
    position,
    keyName,
    frame,
    health,
    facingRight,
    isValidTeleportPositionCallback,
  }: PlayerConfig) {
    super({ scene, position, keyName, health, frame, facingRight });

    this.scene = scene;
    this.spellManager = ServiceLocator.resolve(ServiceKeys.spellManager);
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
    this.isValidTeleportPositionCallback = isValidTeleportPositionCallback;

    this.animations = {
      idle: PLAYER_ANIMATION.IDLE,
      moveLeft: PLAYER_ANIMATION.LEFT,
      moveRight: PLAYER_ANIMATION.RIGHT,
      attack: PLAYER_ANIMATION.SIMPLE_ATTACK,
      instantCast: PLAYER_ANIMATION.INSTANT_CAST,
      death: PLAYER_ANIMATION.DEATH,
    };

    this.movement = new CharacterMovement(PLAYER_STATS.MOVE);

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
    this.stateMachine.addState(new Casting(this, this.controls, this.spellManager, this.ui));
    this.stateMachine.addState(new Ready(this, this.controls, this.ui));
    this.stateMachine.addState(new Death(this, CHARACTERS.PLAYER, 101, this.ui));

    this.stateMachine.changeState('Idle');
  }

  public update(): void {
    this.stateMachine.update();
    this.controls.update();
  }

  public hide(): void {
    this.arcadeBody.enable = false;
    this.setVisible(false);
  }

  public show(): void {
    this.arcadeBody.enable = true;
    this.setVisible(true);
  }

  public teleportTo(distance: number, direction: number): void {
    const step = 5;

    let targetX = this.x + distance * direction;
    let backoff = 0;

    while (targetX !== this.x) {
      if (this.isValidTeleportPositionCallback(targetX, this.y)) {
        this.x = targetX;
        return;
      }
      backoff += step;
      targetX = this.x + (distance - backoff) * direction;
    }
  }

  protected override onDamaged(): void {
    this.ui.reducePlayerHealth(this.currentHealth, this.maxHealth);
  }

  protected override onDeathStart(): void {
    this.controls.disable();
  }
}
