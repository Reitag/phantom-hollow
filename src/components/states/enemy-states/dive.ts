import { CharacterState } from '@/base/states/character-state';
import { Character } from '@/base/objects/character';
import { AUDIO } from '@/constants/asset-keys';
import { CHARACTER_ANIMATION_KEYS } from '@/constants/animation-keys';
import { ENEMY_STATES } from '@/constants/state-keys';
import { Player } from '@/entities/characters/player/player';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';

export class Dive extends CharacterState {
  private player: Player | null = null;
  private damage!: number;
  private isExploded = false;

  constructor(character: Character) {
    super(ENEMY_STATES.DIVE, character);
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
    this.characterSpeed?.addModifier('Dive-speed', diveSpeed);

    const animKey = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.IDLE);
    this.playAnimation(animKey);

    if (!this.player.getDead()) {
      ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.BAT_AGGRO);
    }

    this.character.scene.time.delayedCall(lifeTime, () => {
      if (!this.character.active) return;
      this.explode();
    });
  }

  public onUpdate(delta: number): void {
    if (!this.player || this.player.getDead()) return;

    this.characterSpeed?.update(delta);

    const dx = this.player.x - this.character.x;
    const dy = this.player.y - this.character.y;

    const speed = this.characterSpeed?.velocity ?? 0;

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
      return;
    }
    this.player.takeDamage(this.damage);
    this.damage = 0;
  }

  private explode(): void {
    if (this.isExploded) return;
    this.isExploded = true;

    this.characterSpeed?.setMovementLock(true);

    const animKey = this.character.resolveAnimation(CHARACTER_ANIMATION_KEYS.DEATH);
    this.playAnimation(animKey);

    ServiceLocator.resolve(ServiceKeys.audio).play(AUDIO.BAT_IMPACT);

    this.character.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.character.destroy();
    });
  }
}
