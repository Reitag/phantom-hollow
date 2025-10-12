import { CharacterState } from '@/base/states/character-state';
import { UiSystem } from '@/systems/ui-system';
import { Character } from '@/base/objects/character';
import { Player } from '@/entities/characters/player/player';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Position } from '@/utils/types';

export class Death extends CharacterState {
  private characterKey: string;
  private lastFrame: string | number;
  constructor(
    character: Character,
    characterKey: string,
    lastFrame: string | number,
    ui?: UiSystem
  ) {
    super('Death', character, undefined, undefined, ui);
    this.character = character;
    this.characterKey = characterKey;
    this.lastFrame = lastFrame;
  }

  public onEnter(): void {
    if (!(this.character instanceof Player)) {
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
    this.ui?.removeHighlight();
    this.setToZeroVelocityX();

    this.character.removeAllListeners();
    this.playAnimation(this.animations.death);
    this.character.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.character.setTexture(this.characterKey, this.lastFrame);
    });
  }

  public onUpdate(): void {}
}
