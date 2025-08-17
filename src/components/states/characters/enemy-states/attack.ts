import { CharacterState } from '@/components/states/characters/core/character-state';
import { SkeletonWarrior } from '@/objects/characters/enemies/skeleton-warrior';
import { Player } from '@/objects/characters/player/player';

export class Attack extends CharacterState {
  private player: Player | null = null;
  private frameOnHit!: number;
  private damage!: number;
  private additionAbility: (() => void) | undefined = undefined;
  private canHit = false;

  constructor(character: SkeletonWarrior) {
    super('Attack', character);
  }

  onEnter(...args: unknown[]): void {
    const player = args.find((elem): elem is Player => elem instanceof Player);
    if (!player) throw new Error('Player not found');

    const stats = args.find(
      (elem): elem is number[] => Array.isArray(elem) && elem.every((n) => typeof n === 'number')
    );
    if (!stats || stats.length < 2) throw new Error('Expected numeric array [damage, frameOnHit]');

    const additionAbility = args.find((elem): elem is () => void => typeof elem === 'function');
    if (additionAbility) this.additionAbility = additionAbility;

    const [damage, frameOnHit] = stats;

    this.player = player;
    this.frameOnHit = frameOnHit;
    this.damage = damage;

    this.character.on(Phaser.Animations.Events.ANIMATION_UPDATE, this.enableHit, this);

    this.setToZeroVelocityX();
    this.playAnimation(this.animations.attack, true);
  }

  onUpdate(): void {
    if (!this.player) return;

    const isOverlapping = this.isWithinWeaponReach();

    if (this.canHit) {
      this.player.takeDamage(this.damage);
      this.canHit = false;
      this.additionAbility?.();

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

  private isWithinWeaponReach(): boolean {
    if (!this.player) return false;

    const buffer = 10; // ← weapon reach
    const charBounds = this.character.getBounds();
    const playerBounds = this.player.getBounds();

    Phaser.Geom.Rectangle.Inflate(charBounds, buffer, 0);

    return Phaser.Geom.Intersects.RectangleToRectangle(charBounds, playerBounds);
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
