import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Idle } from '@/components/states/player-states/idle';
import { Movement } from '@/components/states/player-states/movement';
import { Casting } from '@/components/states/player-states/casting';
import { Ready } from '@/components/states/player-states/ready';
import { Death } from '@/components/states/share/death';
import { CHARACTERS } from '@/constants/asset-keys';
import { PLAYER_ANIMATION } from '@/constants/animation-keys';
import { Character, CharacterConfig } from '@/base/objects/character';
import { SpellSystem } from '@/systems/spell-system';
import { UiSystem } from '@/systems/ui-system';
import { InventorySystem } from '@/systems/inventory-system';
import { CoinKeeper } from '@/game/economy/coin-keeper/coin-keeper';

export class Player extends Character {
  scene: Phaser.Scene;
  private controls!: KeyboardController;
  private spellSystem: SpellSystem;
  private ui: UiSystem;
  private inventory: InventorySystem;

  private coinKeeper: CoinKeeper;

  constructor({ scene, position, keyName, frame, facingRight, stats }: CharacterConfig) {
    super({ scene, position, keyName, frame, facingRight, stats });

    this.scene = scene;
    this.spellSystem = ServiceLocator.resolve(ServiceKeys.spellSystem);
    this.ui = ServiceLocator.resolve(ServiceKeys.ui);
    this.inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);

    this.coinKeeper = new CoinKeeper();

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

    const spriteHeight = this.height;
    const spriteWidth = this.width;
    const bodyHeight = 30;
    const bodyWidth = 15;

    this.arcadeBody.setSize(bodyWidth, bodyHeight);
    this.arcadeBody.setOffset((spriteWidth - bodyWidth) / 2, spriteHeight - bodyHeight);
  }

  private initKeyboard(): void {
    const keyboard = this.scene.input.keyboard;
    if (!keyboard) {
      throw new Error('Keyboard input not available yet.');
    }

    this.controls = new KeyboardController(keyboard);
    ServiceLocator.register(ServiceKeys.input, this.controls);
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

  public getCoinKeeper(): CoinKeeper {
    return this.coinKeeper;
  }

  protected override onDamaged(): void {
    this.ui.reducePlayerHealth(this.stats.health!.current, this.stats.health!.max);
  }

  protected override onDeathStart(): void {
    this.controls.disable();
    this.ui.removeAllModfierIcons();
  }
}
