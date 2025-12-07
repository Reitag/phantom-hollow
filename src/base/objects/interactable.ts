import { KeyboardController } from '@/components/controllers/keyboard-controller';
import { Player } from '@/entities/characters/player/player';
import { ServiceKeys, ServiceLocator } from '@/infrastructure/service-locator';
import { Rectangle } from '@/utils/types';

export const InteractableNames = {
  ['soul-pedestal']: 'soul-pedestal',
  ['stall']: 'stall',
  ['fire-worm']: 'fire-worm',
  ['evil-wizard']: 'evil-wizard',
} as const;

export abstract class Interactable {
  protected triggerZones: Phaser.Physics.Arcade.StaticGroup;
  protected player: Player;
  protected input: KeyboardController;

  protected activeZone: Phaser.GameObjects.Zone | null = null;
  protected wasInZone = false;

  constructor(protected scene: Phaser.Scene) {
    this.triggerZones = this.scene.physics.add.staticGroup();
    this.player = ServiceLocator.resolve(ServiceKeys.playerHandler).getPlayer();
    this.input = ServiceLocator.resolve(ServiceKeys.input);
  }

  public update(): void {
    let inZone = false;

    this.triggerZones.children.each((child: Phaser.GameObjects.GameObject) => {
      const zone = child as Phaser.GameObjects.Zone;
      if (this.scene.physics.overlap(this.player, zone)) {
        inZone = true;
        this.activeZone = zone;
      }
      return null;
    });

    if (inZone && !this.wasInZone) {
      this.onEnter();
    }

    if (inZone) {
      if (this.shouldInteract()) {
        this.onInteract();
      }
    }

    if (!inZone && this.wasInZone) {
      this.onLeave();
    }

    this.wasInZone = inZone;
  }

  protected abstract onEnter(): void;
  protected abstract onInteract(): void;
  protected abstract onLeave(): void;

  protected createTriggerZones(value: string): void {
    const map = ServiceLocator.resolve(ServiceKeys.map);
    const objectLayer = map.getObjectLayer('spawn-layer');

    if (!objectLayer) return;

    for (const obj of objectLayer.objects) {
      if (obj.name !== 'interactable-spawn') continue;

      const prop = obj.properties.find(
        (p: { name: string; type: string; value: string }) => p.name === 'trigger'
      );

      if (!prop) continue;

      if (prop.value !== value) continue;

      if (obj.x == null || obj.y == null || obj.width == null || obj.height == null) {
        continue;
      }

      this.addTriggerZone({
        x: obj.x,
        y: obj.y,
        width: obj.width,
        height: obj.height,
      });
    }
  }

  private addTriggerZone(rect: Rectangle): void {
    const { x, y, width, height } = rect;
    const zone = this.scene.add.zone(x, y, width, height).setOrigin(0, 0);

    this.triggerZones.add(zone, true);
  }

  private shouldInteract(): boolean {
    return this.input.isActionDown;
  }
}
