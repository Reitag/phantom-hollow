import { CHARACTERS } from '@/constants/asset-keys';
import { PLAYER_STATS } from '@/constants/object-stats';
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

    if (save && save.health) {
      const health = this.player.getStats().health;
      if (!health) throw new Error('Health is missing');

      health.current = save.health;

      const ui = ServiceLocator.resolve(ServiceKeys.ui);
      ui.reducePlayerHealth(health.current, health.max);
    }

    if (save && save.buffs.length > 0) {
      const modifiers = this.player.getModifier();
      save.buffs.forEach((buff) => {
        if (!modifiers.isModifierExist(buff)) {
          const ui = ServiceLocator.resolve(ServiceKeys.ui);

          modifiers.addModifier(buff);
          modifiers.startModifier(buff, this.player);
          ui.addModifierIcon(buff, undefined, 'buff');
        }
      });
    }

    ServiceLocator.register(ServiceKeys.playerHandler, this);
  }

  public update(delta: number): void {
    this.player.update(delta);

    if (this.player.getDead() && !this.deathHandled) {
      this.deathHandled = true;

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
}
