import { CHARACTERS } from '@/constants/asset-keys';
import { PLAYER_STATS } from '@/constants/object-stats';
import { PENALTY_CONFIG } from '@/constants/penalty-config';
import { QUEST_IDS } from '@/constants/quest-ids';
import { PLAYER_SPAWN_POSITION } from '@/constants/spawn-properies';
import { SHARED_STATES } from '@/constants/state-keys';
import { Z_POSITION } from '@/constants/z-position';
import { Player } from '@/entities/characters/player/player';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Position } from '@/utils/types';

export class PlayerHandler {
  private deathHandled = false;

  private player: Player;
  private x: number;
  private y: number;

  constructor(private scene: Phaser.Scene) {
    const save = ServiceLocator.resolve(ServiceKeys.save);

    let position: Position;
    if (save && save.spawn) {
      position = save.spawn;
    } else {
      position = PLAYER_SPAWN_POSITION;
    }

    this.x = position.x;
    this.y = position.y;

    this.player = new Player({
      scene: scene,
      position: position,
      keyName: CHARACTERS.PLAYER,
      frame: 0,
      stats: {
        health: PLAYER_STATS.HEALTH,
        speed: PLAYER_STATS.MOVE,
        damage: {
          meleeAttack: undefined,
          spellPower: PLAYER_STATS.SPELL_POWER,
        },
        defense: 1,
        casting: true,
        aggro: false,
      },
      facingRight: true,
    }).setDepth(Z_POSITION.PLAYER);

    /*if (save && save.health) {
      const health = this.player.getStats().health;
      if (!health) throw new Error('Health is missing');

      health.current = save.health;

      const ui = ServiceLocator.resolve(ServiceKeys.ui);
      ui.reducePlayerHealth(health.current, health.max);
    }*/

    if (save && save.buffs.length > 0) {
      // Set the global loading flag to prevent buff activation sounds from playing during load
      this.scene.registry.set('is_loading_save', true);

      const modifiers = this.player.getModifier();
      save.buffs.forEach((buff) => {
        if (!modifiers.isModifierExist(buff)) {
          const ui = ServiceLocator.resolve(ServiceKeys.ui);

          modifiers.addModifier(buff);
          modifiers.startModifier(buff, this.player);
        }
      });

      // Reset the flag immediately after loading to enable audio for normal gameplay activations
      this.scene.registry.set('is_loading_save', false);
    }

    if (save?.quests) {
      if (save.quests[QUEST_IDS.ALCHEMIST_FIREWORM] === 'waiting') {
        this.player.setQuestStatus(QUEST_IDS.ALCHEMIST_FIREWORM, true);
      }

      if (save.quests[QUEST_IDS.CRYSTAL] === 'waiting') {
        this.player.setQuestStatus(QUEST_IDS.CRYSTAL, true);
      }
    }

    ServiceLocator.register(ServiceKeys.playerHandler, this);
  }

  public update(delta: number): void {
    this.player.update(delta);

    if (this.player.getDead() && !this.deathHandled) {
      this.deathHandled = true;

      this.setPenaltyToPlayer();

      const ui = ServiceLocator.resolve(ServiceKeys.ui);
      const dialog = ui.addWarningDialog('Do you want to return to your resurrection point?');

      dialog.once('confirm', () => {
        this.respawnAfterResurrect();
      });

      dialog.once('cancel', () => {
        this.scene.cameras.main.fadeOut(500);

        this.scene.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.scene.stop('UiScene');
          this.scene.scene.stop('LevelOneScene');
          this.scene.scene.start('MainMenuScene');
        });
      });
    }
  }

  public getPlayer(): Player {
    return this.player;
  }

  public setNewResurrectPosition(position: Position): void {
    this.x = position.x;
    this.y = position.y;
  }

  private respawnAfterResurrect(): void {
    this.scene.cameras.main.fadeOut(500, 0, 0, 0);

    this.scene.cameras.main.once('camerafadeoutcomplete', () => {
      this.player.x = this.x;
      this.player.y = this.y;

      this.scene.cameras.main.centerOn(this.player.x, this.player.y);

      this.player.getStateMachine().changeState(SHARED_STATES.IDLE);
      this.player.makeAlive();
      this.deathHandled = false;

      this.scene.cameras.main.fadeIn(500, 0, 0, 0);
    });
  }

  private setPenaltyToPlayer(): void {
    const coinKeeper = this.player.getCoinKeeper();
    const penalty = this.calculateDeathPenalty(coinKeeper.coins);
    if (penalty === 0) return;

    coinKeeper.implementPenalty(penalty);
    this.createFloatingPenaltyText(this.player.x, this.player.y, penalty);
  }

  private calculateDeathPenalty(currentGold: number): number {
    const safeGold = PENALTY_CONFIG.SAFE_GOLD_LIMIT;
    if (currentGold <= safeGold) return 0;

    const minGold = PENALTY_CONFIG.MIN_GOLD;
    const maxGold = PENALTY_CONFIG.MAX_GOLD;
    const minPercent = PENALTY_CONFIG.MIN_PERCENT;
    const maxPercent = PENALTY_CONFIG.MAX_PERCENT;

    const clampedGold = Phaser.Math.Clamp(currentGold, minGold, maxGold);
    const progress = Phaser.Math.Percent(clampedGold, minGold, maxGold);
    const currentPenaltyPercent = Phaser.Math.Linear(minPercent, maxPercent, progress);

    let penalty = Math.round(currentGold * currentPenaltyPercent);

    if (currentGold - penalty < safeGold) penalty = currentGold - safeGold;

    return penalty;
  }

  createFloatingPenaltyText(x: number, y: number, amount: number): void {
    const penaltyText = this.scene.add
      .text(x, y - 35, `-${amount} Gold`, {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ff3333',
        stroke: '#000000',
        strokeThickness: 4,
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScale(0)
      .setDepth(Z_POSITION.PLAYER + 1);

    this.scene.tweens.chain({
      targets: penaltyText,
      tweens: [
        {
          scale: 1,
          duration: 240,
          ease: 'Quad.easeOut',
        },
        {
          delay: 6000,
          duration: 0,
        },
        {
          y: penaltyText.y - 60,
          alpha: 0,
          duration: 3000,
          ease: 'Cubic.easeIn',
          onComplete: () => {
            penaltyText.destroy();
          },
        },
      ],
    });
  }
}
