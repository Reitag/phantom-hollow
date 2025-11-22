import { Speed } from '@/components/stats/speed';
import { Character } from '@/base/objects/character';
import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { SPELLS } from '@/constants/asset-keys';
import { PLAYER_STATES } from '@/constants/state-keys';
import { PLAYER_STATS } from '@/constants/object-stats';
import { InventorySystem } from '@/systems/inventory-system';
import { State, StateMachine } from '@/systems/state-machine';
import { SpellSystem } from '@/systems/spell-system';
import { UiSystem } from '@/systems/ui-system';
import { CHARACTER_ANIMATION_KEYS } from '@/constants/animation-keys';
import { Player } from '@/entities/characters/player/player';

export abstract class CharacterState implements State {
  readonly name: string;

  protected character: Character;
  protected characterBody: Phaser.Physics.Arcade.Body;
  protected characterSpeed: Speed | null;
  protected input: KeyboardController | null;
  protected spellSystem: SpellSystem | null;
  protected ui: UiSystem | null;
  protected inventory: InventorySystem | null;

  public stateMachine!: StateMachine;

  constructor(
    name: string,
    character: Character,
    input?: KeyboardController,
    spellSystem?: SpellSystem,
    ui?: UiSystem,
    inventory?: InventorySystem
  ) {
    this.name = name;
    this.character = character;
    this.input = input || null;
    this.spellSystem = spellSystem || null;
    this.ui = ui || null;
    this.inventory = inventory || null;

    this.characterSpeed = character.getStats().speed || null;
    this.characterBody = this.character.getArcadeBody();
  }

  protected setToZeroVelocityX(): void {
    if (this.character.hasVelocity()) {
      this.character.setVelocityX(0);
    }
  }

  protected moveLeft(speed: number | undefined): void {
    if (!speed) return;

    this.character.setVelocityX(-speed);
    this.character.flipCharacterToRight(false);

    const animKey = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.MOVE);
    this.playAnimation(animKey);
  }

  protected moveRight(speed: number | undefined): void {
    if (!speed) return;

    this.character.setVelocityX(speed);
    this.character.flipCharacterToRight(true);

    const animKey = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.MOVE);
    this.playAnimation(animKey);
  }

  protected jump(): void {
    if (this.characterBody.blocked.down) {
      this.character.setVelocityY(PLAYER_STATS.JUMP * -1);
    }
  }

  protected playAnimation(key: string | undefined, force = false): void {
    if (!key) return;
    const exists = this.character.scene.anims.exists(key);
    if (!exists) {
      console.warn(`[Animation missing] ${key}`);
      return;
    }
    if (!force && this.character.anims.currentAnim?.key === key) return;
    this.character.anims.play(key, true);
  }

  protected initToCastSpell(spell: string): void {
    if (!this.canTransitionToCast(spell)) return;
    this.stateMachine.changeState(PLAYER_STATES.READY);
  }

  private canTransitionToCast(spell: string): boolean {
    if (
      this.character instanceof Player &&
      this.character.nextSpellInstant === false &&
      this.name === PLAYER_STATES.MOVEMENT &&
      (spell === SPELLS.FIRE_BALL || spell === SPELLS.FROST_BOLT)
    ) {
      return false;
    }

    if (!this.spellSystem?.canCast(spell)) {
      return false;
    }

    return true;
  }

  public onEnter?(): void {}
  public onUpdate?(delta: number): void {}
  public onExit?(): void {}
}
