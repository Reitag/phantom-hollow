import { CharacterState } from '@/components/states/characters/core/character-state';
import { SkeletonWarrior } from '@/objects/characters/enemies/skeleton-warrior';
import { Player } from '@/objects/characters/player/player';

export class Attack extends CharacterState {
  private player: Player | null = null;
  private frameOnHit!: number;
  private canHit = false;
  constructor(character: SkeletonWarrior) {
    super('Attack', character);
  }

  onEnter(...args: unknown[]): void {
    const player = args.find((elem): elem is Player => elem instanceof Player);
    if (!player) throw new Error('Player not found');

    const frameOnHit = args.find((elem): elem is number => typeof elem === 'number');
    if (frameOnHit === undefined) throw new Error('Expected numeric frameOnHit argument');

    this.character.on(Phaser.Animations.Events.ANIMATION_UPDATE, this.enableHit, this);
    this.player = player;
    this.frameOnHit = frameOnHit;
  }

  onUpdate(): void {
    if (!this.player) return;

    this.setToZeroVelocityX();
    this.playAnimation(this.animations.attack, true);

    if (this.canHit) {
      this.player.takeDamage(25);
      this.canHit = false;
    }

    if (this.player.getDead()) {
      this.character.anims.stop();
      return;
    }
  }

  onExit(): void {
    this.character.off(Phaser.Animations.Events.ANIMATION_UPDATE, this.enableHit, this);
  }

  private enableHit(
    anim: Phaser.Animations.Animation,
    frame: Phaser.Animations.AnimationFrame
  ): void {
    if (anim.key === this.animations.attack && frame.index === this.frameOnHit) {
      this.canHit = true;
    }
  }
}
