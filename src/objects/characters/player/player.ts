import { KeyboardController } from '@/components/input/controllers/keyboard-controller';
import { Idle } from '@/components/states/characters/player-states/idle';
import { Movement } from '@/components/states/characters/player-states/movement';
import { Casting } from '@/components/states/characters/player-states/casting';
import { Ready } from '@/components/states/characters/player-states/ready';
import { Death } from '@/components/states/characters/core/death';
import { Character, CharacterConfig } from '@/objects/core/character';
import { SpellManager } from '@/managers/spell-manager';
import { UiManager } from '@/managers/ui-manager';
import { AnimationKeys } from '@/utils/animation-keys';

interface PlayerConfig extends CharacterConfig {
  spellManager: SpellManager;
  ui: UiManager;
}

export class Player extends Character {
  scene: Phaser.Scene;
  private controls!: KeyboardController;
  private spellManager: SpellManager;
  private ui: UiManager;

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
    this.ui = ui;

    this.animations = {
      idle: AnimationKeys.Player.Idle,
      moveLeft: AnimationKeys.Player.Left,
      moveRight: AnimationKeys.Player.Right,
      attack: AnimationKeys.Player.SimpleAttack,
      death: AnimationKeys.Player.Death,
    };

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
    this.stateMachine.addState(new Death(this, 'player', 101, this.ui));

    this.stateMachine.changeState('Idle');
  }

  update(): void {
    this.stateMachine.update();
    this.controls.update();
  }

  protected override onDamaged(): void {
    this.ui.reducePlayerHealth(this.currentHealth, this.maxHealth);
  }

  protected override onDeathStart(): void {
    this.controls.disable();
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
}
