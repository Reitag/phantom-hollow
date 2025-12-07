import { Character } from '@/base/objects/character';
import { DESTROY_TIME } from '@/constants/spawn-properies';
import { Player } from '@/entities/characters/player/player';
import { TriggerZone } from '@/game/interactables/trigger-zone';

export abstract class Boss {
  protected scene: Phaser.Scene;
  protected boss: Character;
  protected player: Player;
  protected triggerZone: TriggerZone | null = null;
  protected triggered = false;

  constructor(boss: Character, player: Player) {
    this.boss = boss;
    this.player = player;
    this.scene = boss.scene;
  }

  public update(time: number, delta: number): void {
    if (this.boss.getDead()) {
      console.log(this.triggerZone);
      this.finalCall();
      this.removeBoss();
      return;
    }

    this.triggerZone?.update();
    this.updateBossState(time, delta);
  }

  public getBoss(): Character {
    return this.boss;
  }

  public removeBoss(): void {
    if (!this.boss.active) return;

    this.triggerZone = null;
    this.triggered = false;
    this.boss.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      (anim: Phaser.Animations.Animation) => {
        this.boss.active = false;
        this.scene.time.delayedCall(DESTROY_TIME, () => {
          this.boss.destroy();
        });
      }
    );
  }

  protected abstract updateBossState(time: number, delta: number): void;
  protected abstract finalCall(): void;
  protected abstract chillBehaviour(): void;
  protected abstract aggroedBehaviour(): void;

  protected updateAggro(delta: number, range: number): void {
    const aggro = this.boss.getStats().aggro;
    if (!aggro) return;

    if (this.player.getDead()) {
      if (this.triggered) {
        this.triggered = false;
      }
      aggro.reset();
    }

    if (aggro.meter > 0) {
      aggro.decrease(delta);
    }

    const inRange = this.canEngage(range);

    if (!this.triggered && !aggro.isAggroed) {
      this.bossRecovery();
      this.chillBehaviour();
      return;
    }

    if (this.triggered) aggro.increase(10 * delta);
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

  protected triggerOn(): void {
    if (this.triggered === false) {
      this.triggered = true;
    }
  }

  protected triggerOff(): void {
    if (this.triggered === true) {
      this.triggered = false;
    }
  }

  private bossRecovery(): void {
    const health = this.boss.getStats().health;
    if (!health) return;

    while (health.current !== health.max) {
      health.heal(500);
    }
  }
}
