import { HealthBar } from '@/base/ui/health-bar';
import { UI } from '@/constants/asset-keys';

export class PlayerHealthBar extends HealthBar {
  constructor(scene: Phaser.Scene) {
    super(scene, {
      barKey: 'health-bar',
      frameKey: 'health-env',
      barTexture: UI.HEALTH_BAR,
      frameTexture: UI.HEALTH_ENV,
      visibleByDefault: true,
    });
  }
}
