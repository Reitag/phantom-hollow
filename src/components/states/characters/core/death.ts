import { CharacterState } from '@/components/states/characters/core/character-state';
import { UiManager } from '@/managers/ui-manager';
import { Character } from '@/objects/core/character';

export class Death extends CharacterState {
  private characterKey: string;
  private lastFrame: string | number;
  constructor(
    character: Character,
    characterKey: string,
    lastFrame: string | number,
    ui?: UiManager
  ) {
    super('Death', character, undefined, undefined, ui);
    this.character = character;
    this.characterKey = characterKey;
    this.lastFrame = lastFrame;
  }

  onEnter(): void {
    this.ui?.removeHighlight();
    this.setToZeroVelocityX();

    this.character.removeAllListeners();
    this.playAnimation(this.animations.death);
    this.character.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.character.setTexture(this.characterKey, this.lastFrame);
    });
  }

  onUpdate(): void {}
}
