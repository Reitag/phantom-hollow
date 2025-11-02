import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { SpellCooldowns } from '@/components/modules/spell-cooldowns';
import { FIRE_WORM_STATS } from '@/constants/object-stats';
import { Character } from '@/base/objects/character';
import { ENEMY_STATES } from '@/constants/state-keys';
import { Player } from '@/entities/characters/player/player';
import { BOSSES_ANIMATION } from '@/constants/animation-keys';
import { Boss } from '../../base/ai/boss';

export class AiFireWorm extends Boss {
  private static readonly FIREBALL = {
    NAME: 'fireball',
    COOLDOWN: 5000,
  };

  private readonly spellFactory = ServiceLocator.resolve(ServiceKeys.spellFactory);
  private readonly spellCooldowns: SpellCooldowns;
  private readonly castFireballHandler: () => void;

  constructor(boss: Character, player: Player) {
    super(boss, player);
    this.spellCooldowns = new SpellCooldowns(this.boss.scene);
    this.castFireballHandler = this.castFireball.bind(this);
  }

  protected updateBossState(delta: number): void {
    this.boss.update();
    this.updateAggro(delta, FIRE_WORM_STATS.ENGAGE_DISTANCE);
  }

  protected chillBehaviour(): void {
    const fsm = this.boss.getStateMachine();
    const currentState = fsm.currentStateName;

    if (currentState !== ENEMY_STATES.PATROL) {
      fsm.changeState(ENEMY_STATES.PATROL, FIRE_WORM_STATS.WALK_BOUND);
    }
  }
  protected aggroedBehaviour(): void {
    this.updateFacingDirection();

    const fsm = this.boss.getStateMachine();
    const currentState = fsm.currentStateName;

    if (!this.spellCooldowns.isOnCooldown(AiFireWorm.FIREBALL.NAME)) {
      this.spellCooldowns.startCooldown(AiFireWorm.FIREBALL.NAME, AiFireWorm.FIREBALL.COOLDOWN);

      if (currentState !== ENEMY_STATES.CASTING) {
        fsm.changeState(ENEMY_STATES.CASTING, this.castFireballHandler, FIRE_WORM_STATS.CAST);
      }
    }
  }

  private updateFacingDirection(): void {
    this.boss.flipCharacterToRight(this.player.x > this.boss.x);
  }

  private castFireball(): void {
    this.boss.anims.play(BOSSES_ANIMATION.FIRE_WORM.CAST, true);
    const { x, y } = this.boss.getPosition();
    const flip = this.boss.getFacingRight() ? 1 : -1;

    const handOffsetX = 40 * flip;
    const handOffsetY = 20;

    const spawnPosition = {
      x: x + handOffsetX,
      y: y + handOffsetY,
    };

    const fireball = this.spellFactory.createFireball(this.boss, spawnPosition);
    fireball.cast();
  }
}
