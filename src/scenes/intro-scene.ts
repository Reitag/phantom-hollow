export class IntroScene extends Phaser.Scene {
  private storyText!: Phaser.GameObjects.Text;
  private continueButton!: Phaser.GameObjects.Text;

  constructor() {
    super('IntroScene');
  }

  public create(): void {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#000000');

    // Story text
    const content = `
Our Kingdom has endured much and many. Past conflicts with threats from beyond the sea teached us courage and magical discipline, paving a way to generations of mages, warriors, craftsmen, and artists.

But any strong will weakens without an exercise. King Ramon Tarenval, heir of a long dinasty, has grown greedy and cowardly, leading our Kingdom to embrace his sickly example and attracting old foes back to our lands.

Embercrest Highlands, a home of tranquility and ancient wisdom, was shaken by sudden arrival of vile Sacryth The Duskbringer and her minions, ready to feast insatiably on the divine energy we keep dear.

Hokki Silverfir, a local chieftain devoted to defend his land and people from the wielders of dark magic, has called all of us to arms in the darkest hour.

If there is chance at defending the peace and inspiring a change of heart at our Kingdom, it lies with those who believe in light, here and now.

And so, here comes the young apprentice of The Guild Of Mages, urgent to protect their home from evil...

~ From "The Book Of Triumps", The Guild Of Mages Holy Library ~
`;

    this.storyText = this.add
      .text(width / 2, height + 200, content, {
        fontSize: '22px',
        fontFamily: 'Volkhov',
        color: '#ffffff',
        align: 'center',
        lineSpacing: 10,
        wordWrap: { width: 600 },
      })
      .setOrigin(0.5)
      .setShadow(2, 2, '#000000', 4);

    // Infinite-style scroll (no completion trigger)
    this.tweens.add({
      targets: this.storyText,
      y: -this.storyText.height,
      duration: 110000,
      ease: 'Linear',
    });

    // Continue Button
    this.continueButton = this.add
      .text(width / 2, height - 40, 'Continue', {
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#222222',
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Button hover effect
    this.continueButton.on('pointerover', () => {
      this.continueButton.setStyle({ backgroundColor: '#444444' });
    });

    this.continueButton.on('pointerout', () => {
      this.continueButton.setStyle({ backgroundColor: '#222222' });
    });

    // Click = go to game
    this.continueButton.on('pointerdown', () => {
      this.startGame();
    });

    // Fade in
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  private startGame(): void {
    this.cameras.main.fadeOut(800, 0, 0, 0);

    this.time.delayedCall(800, () => {
      this.continueButton.removeAllListeners();
      this.continueButton.destroy();

      this.scene.start('LevelOneScene', {});
    });
  }
}
