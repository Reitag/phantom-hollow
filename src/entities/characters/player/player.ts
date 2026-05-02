import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { PanelService } from '@/infrastructure/panel-service';
import { Idle } from '@/components/states/player-states/idle';
import { Movement } from '@/components/states/player-states/movement';
import { Casting } from '@/components/states/player-states/casting';
import { Death } from '@/components/states/share/death';
import { CHARACTERS, SPELLS } from '@/constants/asset-keys';
import { PLAYER_STATES } from '@/constants/state-keys';
import { CHARACTER_ANIMATION_KEYS, PLAYER_ANIMATION } from '@/constants/animation-keys';
import { Character, CharacterConfig } from '@/base/objects/character';
import { SpellSystem } from '@/systems/spell-system';
import { InventorySystem } from '@/systems/inventory-system';
import { CoinKeeper } from '@/game/economy/coin-keeper';
import { Health } from '@/components/stats/health';
import { Duck } from '@/components/states/player-states/duck';
import { Jump } from '@/components/states/player-states/jump';
import { Fall } from '@/components/states/player-states/fall';
import { SPELL_WARNING_MESSAGES } from '@/constants/warning-messages';
import { FIRE_CRIT } from '@/constants/modifier-stats';
import { QUEST_IDS } from '@/constants/quest-ids';

export class Player extends Character {
  public scene: Phaser.Scene;

  private panel: PanelService;
  private controls: KeyboardController;
  private spellSystem: SpellSystem;
  private inventory: InventorySystem;
  private coinKeeper: CoinKeeper;
  private questsStatus: Record<string, boolean> = {
    [QUEST_IDS.ALCHEMIST_FIREWORM]: false,
    [QUEST_IDS.CRYSTAL]: false,
  };

  constructor({ scene, position, keyName, frame, facingRight, stats }: CharacterConfig) {
    super({ scene, position, keyName, frame, facingRight, stats });

    this.scene = scene;
    this.spellSystem = ServiceLocator.resolve(ServiceKeys.spellSystem);
    this.inventory = ServiceLocator.resolve(ServiceKeys.inventorySystem);
    this.controls = ServiceLocator.resolve(ServiceKeys.input);
    this.panel = ServiceLocator.resolve(ServiceKeys.panel);
    this.coinKeeper = new CoinKeeper();

    this.animations = {
      [CHARACTER_ANIMATION_KEYS.IDLE]: PLAYER_ANIMATION.IDLE,
      [CHARACTER_ANIMATION_KEYS.MOVE]: PLAYER_ANIMATION.MOVE,
      [CHARACTER_ANIMATION_KEYS.JUMP]: PLAYER_ANIMATION.JUMP,
      [CHARACTER_ANIMATION_KEYS.FALL]: PLAYER_ANIMATION.FALL,
      [CHARACTER_ANIMATION_KEYS.CAST.CAST_START]: PLAYER_ANIMATION.CAST_START,
      [CHARACTER_ANIMATION_KEYS.CAST.CAST_MAIN]: PLAYER_ANIMATION.CAST_MAIN,
      [CHARACTER_ANIMATION_KEYS.CAST.CAST_END]: PLAYER_ANIMATION.CAST_END,
      [CHARACTER_ANIMATION_KEYS.CAST.INSTANT_CAST]: PLAYER_ANIMATION.INSTANT_CAST,
      [CHARACTER_ANIMATION_KEYS.DEATH]: PLAYER_ANIMATION.DEATH,
    };

    this.initStateMachine();

    const spriteHeight = this.height;
    const spriteWidth = this.width;
    const bodyHeight = 30;
    const bodyWidth = 15;

    this.arcadeBody.setSize(bodyWidth, bodyHeight);
    this.arcadeBody.setOffset((spriteWidth - bodyWidth) / 2, spriteHeight - bodyHeight);
  }

  private initStateMachine(): void {
    this.stateMachine.addState(
      new Idle(this, this.controls, this.spellSystem, this.ui, this.inventory)
    );
    this.stateMachine.addState(
      new Jump(this, this.controls, this.spellSystem, this.ui, this.inventory)
    );
    this.stateMachine.addState(
      new Fall(this, this.controls, this.spellSystem, this.ui, this.inventory)
    );
    this.stateMachine.addState(
      new Duck(this, this.controls, this.inventory, CHARACTERS.PLAYER, 38)
    );
    this.stateMachine.addState(
      new Movement(this, this.controls, this.spellSystem, this.ui, this.inventory)
    );
    this.stateMachine.addState(new Casting(this, this.controls, this.spellSystem, this.ui));
    this.stateMachine.addState(new Death(this, CHARACTERS.PLAYER, 69, this.ui));

    this.stateMachine.changeState(PLAYER_STATES.IDLE);
  }

  public isQuestActive(id: string): boolean {
    return this.questsStatus[id];
  }

  public setQuestStatus(id: string, value: boolean): void {
    this.questsStatus[id] = value;
  }

  public update(delta: number): void {
    if (this.getDead()) return;
    this.stateMachine.update(delta);
    this.controls.update();
    this.panel.update(this.controls);
    this.handleFall();
  }

  public getCoinKeeper(): CoinKeeper {
    return this.coinKeeper;
  }

  public attemptToCastFromSlot(spellId: string): void {
    const spell = Object.values(SPELLS).find((s) => s === spellId);
    if (!spell) return;

    const ui = ServiceLocator.resolve(ServiceKeys.ui);

    if (!this.spellSystem.canCast(spell)) {
      ui.addWarningtext(SPELL_WARNING_MESSAGES.SPELL_NOT_READY);
      return;
    }

    if ((spell === SPELLS.FIRE_BALL || spell === SPELLS.FROST_BOLT) && this.hasVelocity()) {
      ui.addWarningtext(SPELL_WARNING_MESSAGES.CANNOT_CAST_MOVING);
      return;
    }

    this.stateMachine.changeState(PLAYER_STATES.CASTING, spell);
  }

  protected override onDamaged(): void {
    this.ui.reducePlayerHealth(this.stats.health!.current, this.stats.health!.max);

    /*SaveService.patch({
      health: this.stats.health!.current,
    });*/
  }

  protected override onDeathStart(): void {
    this.controls.disable();
    this.ui.removeAllModfierIcons();
    if (this.modifier.isModifierExist(FIRE_CRIT.id)) {
      this.modifier.removeModifier(FIRE_CRIT.id);
    }
    ServiceLocator.resolve(ServiceKeys.sandbox).resetFireStacks();
  }

  protected override onAliveStart(): void {
    this.controls.enable();
    const max = this.stats.health?.max;
    if (!max) throw new Error("Uknown character's max health");

    this.stats.health = null;
    this.stats.health = new Health(max);
    this.ui.restorePlayerHealth();

    /*SaveService.patch({
      health: max,
    });*/
  }

  private handleFall(): void {
    if (!this.arcadeBody.blocked.down) {
      if (this.stateMachine.currentStateName !== PLAYER_STATES.JUMP) {
        if (this.stateMachine.currentStateName !== PLAYER_STATES.FALL) {
          this.stateMachine.changeState(PLAYER_STATES.FALL);
        }
      }
    }
  }
}
