import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Idle } from '@/components/states/player-states/idle';
import { Movement } from '@/components/states/player-states/movement';
import { Casting } from '@/components/states/player-states/casting';
import { Ready } from '@/components/states/player-states/ready';
import { Death } from '@/components/states/share/death';
import { CHARACTERS } from '@/constants/asset-keys';
import { PLAYER_ANIMATION } from '@/constants/animation-keys';
import { Character, CharacterConfig } from '@/base/entites/character';
import { SpellSystem } from '@/systems/spell-system';
import { UiSystem } from '@/systems/ui-system';
import { InventorySystem } from '@/systems/inventory-system';

interface PlayerConfig extends CharacterConfig {
  isValidTeleportPositionCallback: (x: number, y: number) => boolean;
}

export class Player extends Character {
  scene: Phaser.Scene;
  private controls!: KeyboardController;
  private spellSystem: SpellSystem;
  private ui: UiSystem;
  private inventory: InventorySystem;
  private isValidTeleportPositionCallback: (x: number, y: number) => boolean;

  constructor({
    scene,
    position,
    keyName,
    frame,
    facingRight,
    stats,
    isValidTeleportPositionCallback,
  }: PlayerConfig) {
    super({ scene, position, keyName, frame, facingRight, stats });

    this.scene = scene;
    this.spellSystem = ServiceLocator.resolve(ServiceKeys.spellSystem);
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
    this.inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);
    this.isValidTeleportPositionCallback = isValidTeleportPositionCallback;

    this.animations = {
      idle: PLAYER_ANIMATION.IDLE,
      moveLeft: PLAYER_ANIMATION.LEFT,
      moveRight: PLAYER_ANIMATION.RIGHT,
      attack: PLAYER_ANIMATION.SIMPLE_ATTACK,
      instantCast: PLAYER_ANIMATION.INSTANT_CAST,
      death: PLAYER_ANIMATION.DEATH,
    };

    this.initKeyboard();
    this.initStateMachine();

    /*const spriteHeight = this.height;
    const bodyHeight = 30;
    const bodyWidth = 20;

    this.arcadeBody.setSize(bodyWidth, bodyHeight);
    this.arcadeBody.setOffset((spriteHeight - bodyWidth) / 2, spriteHeight - bodyHeight);*/
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
    this.stateMachine.addState(new Idle(this, this.controls, this.spellSystem, this.inventory));
    this.stateMachine.addState(new Movement(this, this.controls, this.spellSystem, this.inventory));
    this.stateMachine.addState(new Casting(this, this.controls, this.spellSystem, this.ui));
    this.stateMachine.addState(new Ready(this, this.controls, this.ui));
    this.stateMachine.addState(new Death(this, CHARACTERS.PLAYER, 101, this.ui));

    this.stateMachine.changeState('Idle');
  }

  public update(delta: number): void {
    this.stateMachine.update(delta);
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
    this.ui.reducePlayerHealth(this.stats.health!.current, this.stats.health!.max);
  }

  protected override onDeathStart(): void {
    this.controls.disable();
    this.ui.removeAllModfierIcons();
  }
}
