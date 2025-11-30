import { Character } from '@/base/objects/character';
import { DESTROY_TIME } from '@/constants/spawn-properies';
import { Player } from '@/entities/characters/player/player';

export abstract class Boss {
  protected boss: Character;
  protected player: Player;

  constructor(boss: Character, player: Player) {
    this.boss = boss;
    this.player = player;
  }

  public update(delta: number): void {
    if (this.boss.getDead()) {
      this.finalCall();
      this.removeBoss();
      return;
    }
    this.updateBossState(delta);
  }

  public getBoss(): Character {
    return this.boss;
  }

  public removeBoss(): void {
    if (!this.boss.active) return;

    this.boss.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      (anim: Phaser.Animations.Animation) => {
        this.boss.active = false;
        this.boss.scene.time.delayedCall(DESTROY_TIME, () => {
          this.boss.destroy();
        });
      }
    );
  }

  protected abstract updateBossState(delta: number): void;
  protected abstract finalCall(): void;
  protected abstract chillBehaviour(): void;
  protected abstract aggroedBehaviour(): void;

  protected updateAggro(delta: number, range: number): void {
    const aggro = this.boss.getStats().aggro;
    if (!aggro) return;

    if (this.player.getDead()) aggro.reset();

    if (aggro.meter > 0) {
      aggro.decrease(delta);
    }

    const inRange = this.canEngage(range);

    if (!inRange && !aggro.isAggroed) {
      this.chillBehaviour();
      return;
    }

    if (inRange) aggro.increase(10 * delta);
    if (aggro.isAggroed) this.aggroedBehaviour();
  }

  protected canEngage(range: number): boolean {
    if (!this.player || this.player.getDead()) return false;

    const inRange =
      Math.abs(this.boss.x - this.player.x) < range && Math.abs(this.boss.y - this.player.y) < 45;

    if (inRange) {
      return true;
    }
    return false;
  }
}
