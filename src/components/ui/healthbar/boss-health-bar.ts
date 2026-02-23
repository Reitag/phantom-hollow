import { UI } from '@/constants/asset-keys';
import { HealthBar } from '@/base/ui/health-bar';

export class BossHealthBar extends HealthBar {
  private nameText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, bossName: string) {
    super(scene, {
      barKey: 'boss-health-bar',
      frameKey: 'boss-health-env',
      barTexture: UI.BOSS_HEALTH_BAR,
      frameTexture: UI.BOSS_HEALTH_ENV,
      visibleByDefault: false,
    });

    const rightEdge = this.frame.x + this.frame.width;
    const bottomY = this.frame.y + this.frame.height + 20;

    this.nameText = scene.add
      .text(rightEdge, bottomY, bossName, {
        fontFamily: 'Arial Black, Gadget, sans-serif',
        fontStyle: 'normal',
        fontSize: '22px',
        color: '#f2a619',
        stroke: '#2a1a1a',
        strokeThickness: 2,
        align: 'right',
        wordWrap: {
          width: 310,
          useAdvancedWrap: true,
        },
      })
      .setOrigin(1, 0)
      .setShadow(1, 2, 'rgba(0,0,0,0.45)', 1, false, true)
      .setVisible(false);
  }

  public override show(): void {
    super.show();
    this.nameText.setVisible(true);
  }

  public override hide(): void {
    super.hide();
    this.nameText.setVisible(false);
  }

  public override destroy(): void {
    super.destroy();
    this.nameText.destroy();
  }
}
