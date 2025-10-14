import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { SpellCooldowns } from '@/components/modules/spell-cooldowns';
import { DREAD_AURA_STATS, EVIL_WIZARD_STATS, MUTATED_BAT_STATS } from '@/constants/object-stats';
import { SHADOW_BOLT, SUMMON_BAT } from '@/constants/spell-cooldowns';
import { Character } from '@/base/objects/character';
import { Player } from '@/entities/characters/player/player';
import { DreadAura } from '@/entities/spells/aura-spells/dread-aura';
import { BOSSES_ANIMATION } from '@/constants/animation-keys';
import { MutatedBat } from '@/entities/characters/enemies/mutated-bat';
import { CHARACTERS } from '@/constants/asset-keys';
import { Z_POSITION } from '@/constants/z-position';
import { Boss } from '../../base/ai/boss';
import { AiMutatedBat } from '../enemies/ai-mutated-bat';

export class AiEvilWizard extends Boss {
  private dreadAura: DreadAura;
  private spellFactory = ServiceLocator.resolve(ServiceKeys.spellFactory);
  private spellCooldown: SpellCooldowns;
  private aiMutatedBat: AiMutatedBat;
  private castShadowBoltBind: () => void;

  constructor(boss: Character, player: Player) {
    super(boss, player);
    this.dreadAura = new DreadAura(
      {
        scene: boss.scene,
        position: { x: boss.x, y: boss.y },
        keyName: DREAD_AURA_STATS.KEY_NAME,
        damage: DREAD_AURA_STATS.DAMAGE,
      },
      DREAD_AURA_STATS.RANGE
    );
    this.aiMutatedBat = new AiMutatedBat(this.player, null);
    this.spellCooldown = new SpellCooldowns(this.boss.scene);
    this.castShadowBoltBind = this.castShadowBolt.bind(this);
  }

  public update(delta: number): void {
    this.aiMutatedBat.update(delta);

    if (this.boss.getDead()) {
      return;
    }

    if (!this.canEngage(EVIL_WIZARD_STATS.ENGAGE_DISTANCE)) return;
    if (this.player.x > this.boss.x) {
      this.boss.flipCharacterToRight(true);
    } else {
      this.boss.flipCharacterToRight(false);
    }

    this.dreadAura.update(this.player, delta);
    const fms = this.boss.getStateMachine();
    const currentState = fms.currentStateName;

    if (!this.spellCooldown.isOnCooldown(SHADOW_BOLT.NAME)) {
      this.spellCooldown.startCooldown(SHADOW_BOLT.NAME, SHADOW_BOLT.DURATION);
      if (currentState !== 'Casting') {
        fms.changeState('Casting', this.castShadowBoltBind, EVIL_WIZARD_STATS.CAST);
      }
    }

    if (!this.spellCooldown.isOnCooldown(SUMMON_BAT.NAME)) {
      this.spellCooldown.startCooldown(SUMMON_BAT.NAME, SUMMON_BAT.DURATION);
      this.summonBat();
    }
  }

  private summonBat(): void {
    const direction = this.boss.getFacingRight();
    const x = this.boss.x;
    const y = this.boss.y;
    const yRand = Math.floor(Math.random() * (20 + 1)) + y;
    const xCoor = x + 20 * (direction ? 1 : -1);

    const bat = new MutatedBat({
      scene: this.boss.scene,
      position: { x: xCoor, y: yRand },
      keyName: CHARACTERS.MUTATED_BAT,
      frame: 0,
      facingRight: direction,
      stats: {
        health: MUTATED_BAT_STATS.HEALTH,
        speed: MUTATED_BAT_STATS.FLY,
        damage: {
          meleeAttack: undefined,
          spellPower: undefined,
        },
        defense: undefined,
      },
    });

    bat.setDepth(Z_POSITION.ENEMY);
    this.aiMutatedBat.addEnemy(bat);
  }

  private castShadowBolt(): void {
    //const direction = this.boss.getFacingRight() ? 1 : -1;
    //const x = this.boss.x;
    //const y = this.boss.y;
    //const yCoor = y + 15;
    //const xCoor = x + 50 * direction;
    this.boss.anims.play(BOSSES_ANIMATION.EVIL_WIZARD.SIMPLE_ATTACK, true);
    //const shadowBolt = this.spellFactory.createShadowBolt(xCoor, yCoor, direction);
    const shadowBolt = this.spellFactory.createShadowBolt(this.boss);
    shadowBolt.cast();
  }
}
