import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { SpellSystem } from '@/systems/spell-system';
import { PLAYER_STATES } from '@/constants/state-keys';
import { SPELL_WARNING_MESSAGES } from '@/constants/warning-messages';
import { SpellPower } from '@/components/stats/damage';
import { UiSystem } from '@/systems/ui-system';
import { InventorySystem } from '@/systems/inventory-system';
import { SPELLS } from '@/constants/asset-keys';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { getUiCoords } from '@/utils/helpers';
import { CharacterState } from './character-state';
import { Character } from '../objects/character';

export abstract class PlayerState extends CharacterState {
  private uiCoords: Phaser.Types.Tilemaps.TiledObject[];
  constructor(
    name: string,
    character: Character,
    input?: KeyboardController,
    spellSystem?: SpellSystem,
    ui?: UiSystem,
    inventory?: InventorySystem
  ) {
    super(name, character, input, spellSystem, ui, inventory);

    this.uiCoords = ServiceLocator.resolve(ServiceKeys.uiCoords);
  }

  protected movement(): void {
    if (this.input?.isLeftDown) {
      this.moveLeft(this.characterSpeed?.velocity);
    } else if (this.input?.isRightDown) {
      this.moveRight(this.characterSpeed?.velocity);
    } else {
      this.character.setVelocityX(0);
    }
  }

  protected jump(): void {
    if (this.characterBody.blocked.down) {
      this.stateMachine.changeState(PLAYER_STATES.JUMP);
    }
  }

  protected attemptToCast(): void {
    // ───────── Primary (Fireball)
    if (this.input?.isPrimaryActionDown) {
      this.ui?.highlightSpell(getUiCoords(this.uiCoords, 'primary'));
      return;
    }

    if (this.input?.isPrimaryActionReleased) {
      this.ui?.removeHighlight();

      const spell = SPELLS.FIRE_BALL;

      if ((this.character.getStats().damage.spellPower as SpellPower).isInstantCast) {
        this.stateMachine.changeState(PLAYER_STATES.CASTING, spell);
        return;
      }

      if (!this.spellSystem?.canCast(spell)) {
        this.ui?.addWarningtext(SPELL_WARNING_MESSAGES.SPELL_NOT_READY);
        return;
      }

      if (this.character.hasVelocity()) {
        this.ui?.addWarningtext(SPELL_WARNING_MESSAGES.CANNOT_CAST_MOVING);
        return;
      }

      this.stateMachine.changeState(PLAYER_STATES.CASTING, spell);
      return;
    }

    // ───────── Secondary (Blink)
    if (this.input?.isSecondaryActionDown) {
      this.ui?.highlightSpell(getUiCoords(this.uiCoords, 'secondary'));
      return;
    }

    if (this.input?.isSecondaryActionReleased) {
      this.ui?.removeHighlight();

      if (!this.spellSystem?.canCast(SPELLS.BLINK)) {
        this.ui?.addWarningtext(SPELL_WARNING_MESSAGES.SPELL_NOT_READY);
        return;
      }

      this.stateMachine.changeState(PLAYER_STATES.CASTING, SPELLS.BLINK);
      return;
    }

    // ───────── Tertiary (Wind Wave)
    if (this.input?.isTertiaryActionDown) {
      this.ui?.highlightSpell(getUiCoords(this.uiCoords, 'tertiary'));
      return;
    }

    if (this.input?.isTertiaryActionReleased) {
      this.ui?.removeHighlight();

      if (!this.spellSystem?.canCast(SPELLS.WIND_WAVE)) {
        this.ui?.addWarningtext(SPELL_WARNING_MESSAGES.SPELL_NOT_READY);
        return;
      }

      this.stateMachine.changeState(PLAYER_STATES.CASTING, SPELLS.WIND_WAVE);
      return;
    }

    // ───────── Quaternary (Frostbolt)
    if (this.input?.isQuaternaryActionDown) {
      this.ui?.highlightSpell(getUiCoords(this.uiCoords, 'quaternary'));
      return;
    }

    if (this.input?.isQuaternaryActionReleased) {
      this.ui?.removeHighlight();

      if (!this.spellSystem?.canCast(SPELLS.FROST_BOLT)) {
        this.ui?.addWarningtext(SPELL_WARNING_MESSAGES.SPELL_NOT_READY);
        return;
      }

      if (this.character.hasVelocity()) {
        this.ui?.addWarningtext(SPELL_WARNING_MESSAGES.CANNOT_CAST_MOVING);
        return;
      }

      this.stateMachine.changeState(PLAYER_STATES.CASTING, SPELLS.FROST_BOLT);
    }
  }
}
