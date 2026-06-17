import { Interactable, InteractableNames } from '@/base/objects/interactable';
import { Health } from '@/components/stats/health';
import { Dialog } from '@/components/ui/dialog/dialog';
import { MISC, OBJECTS, UI } from '@/constants/asset-keys';
import { CRYSTAL_SHRINE_STATS } from '@/constants/object-stats';
import { BONFIRE_TOOLTIP } from '@/constants/tooltip-params';
import { INTERACT_TOOLTIP } from '@/constants/ui-coordinates';
import { Z_POSITION } from '@/constants/z-position';
import { Campfire } from '@/entities/misc/campfire';
import { SaveService } from '@/infrastructure/save-service';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';

type BonfireData = {
  id: string;
  zone: Phaser.GameObjects.Zone;
  activated: boolean;
  vfx: Phaser.GameObjects.Image | Campfire;
};

export class Bonfire extends Interactable {
  // Bonfire
  private bonfires: BonfireData[] = [];
  private activeBonfireId: string | null = null;

  // Heal effect
  private health: Health | null = null;
  private circle: Phaser.GameObjects.Arc | null = null;

  // Dialog
  private dialog: Dialog | null = null;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.createTriggerZones(InteractableNames['bonfire']);

    const save = ServiceLocator.resolve(ServiceKeys.save);
    const zones = this.triggerZones.getChildren();

    this.createBonfire('bonfire-1', zones[0] as Phaser.GameObjects.Zone);
    this.createBonfire('bonfire-2', zones[1] as Phaser.GameObjects.Zone);
    this.createBonfire('bonfire-3', zones[2] as Phaser.GameObjects.Zone);

    // Restore activate pedestal
    if (save?.worldState.activePedestal) {
      const active = this.bonfires.find((bonfire) => bonfire.id === save.worldState.activePedestal);

      if (active) {
        this.activateBonfire(active);
      }
    }
  }

  public override update(delta?: number): void {
    super.update();

    if (!this.health || this.player.getDead()) return;

    const bonfire = this.getCurrentBonfire();
    if (!bonfire || !bonfire.activated /* || !bonfire.healing*/) return;

    const dt = (delta ?? 1000) / 1000;

    this.health.heal(CRYSTAL_SHRINE_STATS.HEAL * dt);

    const ui = ServiceLocator.resolve(ServiceKeys.ui);
    ui.reducePlayerHealth(this.health.current, this.health.max);

    this.circle?.setPosition(this.player.x, this.player.y + 6);
  }

  protected onEnter(): void {
    const bonfire = this.getCurrentBonfire();
    if (!bonfire || !bonfire.activated) {
      this.ui.showHorizontalTooltip(
        {
          x: INTERACT_TOOLTIP.X,
          y: INTERACT_TOOLTIP.Y,
          width: INTERACT_TOOLTIP.WIDTH,
          fillColor: INTERACT_TOOLTIP.FILL_COLOR,
        },
        BONFIRE_TOOLTIP
      );
      return;
    }

    this.startHealing(bonfire);
  }

  protected onInteract(): void {
    this.ui.hideTooltip();

    const bonfire = this.getCurrentBonfire();
    if (!bonfire) return;

    const uiScene = this.scene.scene.get('UiScene');
    const ui = ServiceLocator.resolve(ServiceKeys.ui);
    this.dialog = new Dialog(uiScene);

    // Already active
    if (bonfire.activated) {
      ui.addWarningtext("You can't set this Spawn Point again");
      return;
    }

    this.dialog.setWarningDialog('Setting a new spawn point costs 10 coins.');

    this.dialog.once('confirm', () => {
      this.settingNewSpawnPoint(bonfire);
    });

    this.dialog.once('cancel', () => {
      this.destroyDialogBox();
      return;
    });
  }

  protected onLeave(): void {
    this.ui.hideTooltip();
    this.stopHealing();

    if (this.dialog) {
      this.destroyDialogBox();
    }
  }

  private settingNewSpawnPoint(bonfire: BonfireData): void {
    const playerHandler = ServiceLocator.resolve(ServiceKeys.playerHandler);
    const coinKeeper = playerHandler.getPlayer().getCoinKeeper();
    const cost = 10;

    // Not enough coins
    if (!coinKeeper.removeCoins(cost)) {
      this.destroyDialogBox();
      return;
    }

    // Deactivate previous bonfire
    if (this.activeBonfireId) {
      const prev = this.bonfires.find((bonfire) => bonfire.id === this.activeBonfireId);
      if (prev && prev.activated) {
        prev.vfx.destroy();
        prev.vfx = this.scene.add
          .image(prev.zone.x, prev.zone.y, OBJECTS.BONFIRE_OFF)
          .setOrigin(-1, -1)
          .setDepth(Z_POSITION.DECOR);
        prev.activated = false;
      }
    }

    // Activate new bonfire
    this.activateBonfire(bonfire);
    this.activeBonfireId = bonfire.id;

    const newSpawn = {
      x: bonfire.zone.x,
      y: bonfire.zone.y + 20,
    };

    playerHandler.setNewResurrectPosition(newSpawn);

    SaveService.patch({
      spawn: newSpawn,
      scene: this.scene.scene.key,
      worldState: {
        ...SaveService.data.worldState,
        activePedestal: bonfire.id,
      },
    });
  }

  private createBonfire(id: string, zone: Phaser.GameObjects.Zone): void {
    this.bonfires.push({
      id,
      zone,
      activated: false,
      vfx: this.scene.add
        .image(zone.x, zone.y, OBJECTS.BONFIRE_OFF, 0)
        .setOrigin(-1, -1)
        .setDepth(Z_POSITION.DECOR),
    });
  }

  private startHealing(bonfire: BonfireData): void {
    this.health = this.player.getStats().health;

    this.circle = this.scene.add
      .circle(this.player.x, this.player.y + 6, 30, 0xffaa00, 0.25)
      .setDepth(this.player.depth + 1);

    //bonfire.healing = true;

    const ui = ServiceLocator.resolve(ServiceKeys.ui);
    ui.addModifierIcon(UI.CRYSTAL_RENEWAL_BUFF, undefined, 'buff');
  }

  private stopHealing(): void {
    const ui = ServiceLocator.resolve(ServiceKeys.ui);

    ui.removeModifierIcon(UI.CRYSTAL_RENEWAL_BUFF);

    this.health = null;
    this.circle?.destroy();
    this.circle = null;

    //this.bonfires.forEach((b) => (b.healing = false));
  }

  private activateBonfire(bonfire: BonfireData): void {
    if (bonfire.activated) return;

    bonfire.vfx.destroy();

    bonfire.vfx = new Campfire({
      scene: this.scene,
      position: { x: bonfire.zone.x, y: bonfire.zone.y },
      keyName: MISC.BONFIRE,
      frame: 0,
    });

    bonfire.activated = true;
  }

  private getCurrentBonfire(): BonfireData | null {
    if (!this.activeZone) return null;
    return this.bonfires.find((bonfire) => bonfire.zone === this.activeZone) ?? null;
  }

  private destroyDialogBox(): void {
    if (this.dialog) {
      this.dialog.destroy();
      this.dialog = null;
    }
  }
}
