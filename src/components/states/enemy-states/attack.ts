import { CharacterState } from '@/components/states/core/character-state';
import { Player } from '@/objects/characters/player/player';
import { Character } from '@/objects/core/character';

export class Attack extends CharacterState {
  private player: Player | null = null;
  private frameOnHit!: number;
  private damage!: number;
  private additionAbility: (() => void) | undefined = undefined;
  private canHit = false;

  constructor(character: Character) {
    super('Attack', character);
  }

  public onEnter(...args: unknown[]): void {
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

    this.characterSpeed?.setMovementLock(true);
    this.playAnimation(this.animations.attack, true);
  }

  public onUpdate(delta: number): void {
    if (!this.player) return;

    this.characterSpeed?.update(delta);

    const direction = this.character.x > this.player.x ? -1 : 1;
    this.character.setVelocityX(direction * (this.characterSpeed?.velocity ?? 0));

    const isOverlapping = this.isWithinAttackReach();

    if (this.canHit) {
      this.player.takeDamage(this.damage);
      this.additionAbility?.();
      this.canHit = false;
    }

    if (!isOverlapping) {
      this.character.stop();
    }

    if (this.player.getDead()) {
      this.character.anims.stop();
      return;
    }
  }

  public onExit(): void {
    this.characterSpeed?.setMovementLock(false);
    this.character.off(Phaser.Animations.Events.ANIMATION_UPDATE, this.enableHit, this);
  }

  private isWithinAttackReach(): boolean {
    if (!this.player) return false;

    const buffer = 20; // attack reach
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
