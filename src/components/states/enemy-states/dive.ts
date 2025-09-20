import { CharacterState } from '@/components/states/core/character-state';
import { Character } from '@/objects/core/character';
import { Player } from '@/objects/characters/player/player';

export class Dive extends CharacterState {
  private player: Player | null = null;
  private damage!: number;

  constructor(character: Character) {
    super('Dive', character);
  }

  public onEnter(...args: unknown[]): void {
    const player = args.find((elem): elem is Player => elem instanceof Player);
    if (!player) throw new Error('Player not found');

    const stats = args.find(
      (elem): elem is number[] => Array.isArray(elem) && elem.every((n) => typeof n === 'number')
    );
    if (!stats || stats.length < 3) throw new Error('Expected numeric array [diveSpeed, damage]');

    const [diveSpeed, damage, lifeTime] = stats;

    this.player = player;
    this.damage = damage;
    this.characterMovement.addModifier('Dive-speed', diveSpeed);
    this.playAnimation(this.animations.idle);

    this.character.scene.time.delayedCall(lifeTime, () => {
      if (!this.character.active) return;
      this.explode();
    });
  }

  public onUpdate(): void {
    if (!this.player || this.player.getDead()) return;

    const dx = this.player.x - this.character.x;
    const dy = this.player.y - this.character.y;

    const speed = this.characterMovement.getCurrentSpeed();

    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0) {
      this.character.setVelocityX((dx / distance) * speed);
      this.character.setVelocityY((dy / distance) * speed);
    }

    if (distance < 20) {
      this.hitTarget();
      this.explode();
    }
  }

  public onExit(): void {}

  private hitTarget(): void {
    if (!this.player || this.player.getDead()) return;
    if (this.damage === 0) {
      this.player.takeDamage(this.damage);
      return;
    }
    this.player.takeDamage(this.damage);
    this.damage = 0;
  }

  private explode(): void {
    this.characterMovement.setMovementLock(true);
    this.playAnimation(this.animations.death);
    this.character.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.character.destroy();
    });
  }
}
