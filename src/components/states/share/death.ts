import { CharacterState } from '@/base/states/character-state';
import { UiSystem } from '@/systems/ui-system';
import { Character } from '@/base/objects/character';
import { SHARED_STATES } from '@/constants/state-keys';
import { Player } from '@/entities/characters/player/player';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Position } from '@/utils/types';
import { CHARACTER_ANIMATION_KEYS } from '@/constants/animation-keys';
import { FireWorm } from '@/entities/characters/bosses/fire-worm';

export class Death extends CharacterState {
  private characterKey: string;
  private lastFrame: string | number;
  constructor(
    character: Character,
    characterKey: string,
    lastFrame: string | number,
    ui?: UiSystem
  ) {
    super(SHARED_STATES.DEATH, character, undefined, undefined, ui);
    this.character = character;
    this.characterKey = characterKey;
    this.lastFrame = lastFrame;
  }

  public onEnter(): void {
    if (!(this.character instanceof Player || this.character instanceof FireWorm)) {
      const loot = ServiceLocator.resolve(ServiceKeys.lootSystem);

      const coinCount = Phaser.Math.Between(1, 3);

      const positions: Position[] = [];
      for (let i = 0; i < coinCount; i++) {
        const offsetX = Phaser.Math.Between(-15, 15);
        const offsetY = Phaser.Math.Between(6, 11);
        positions.push({
          x: this.character.x + offsetX,
          y: this.character.y + offsetY,
        });
      }

      loot.spawnCoins(positions);
    }
    //this.ui?.removeHighlight(); This line triggers error
    this.setToZeroVelocityX();

    this.character.removeAllListeners();

    const animKey = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.DEATH);
    this.playAnimation(animKey);

    this.character.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.character.setTexture(this.characterKey, this.lastFrame);
    });
  }

  public onUpdate(): void {}
}
