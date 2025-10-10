import { CharacterState } from '@/base/states/character-state';
import { Character } from '@/base/objects/character';
import { Player } from '@/entities/characters/player/player';

export class Hover extends CharacterState {
  private player: Player | null = null;
  private orbitAngle!: number;
  private orbitRadius!: number;
  private orbitSpeed!: number;
  private verticalOffset!: number;

  constructor(character: Character) {
    super('Hover', character);
  }

  public onEnter(...args: unknown[]): void {
    const player = args.find((elem): elem is Player => elem instanceof Player);
    if (!player) throw new Error('Player not found');

    const stats = args.find(
      (elem): elem is number[] => Array.isArray(elem) && elem.every((n) => typeof n === 'number')
    );
    if (!stats || stats.length < 4)
      throw new Error(
        'Expected numeric array [orbitAngle, orbitRadius, orbitSpeed, verticalOffset]'
      );

    const [orbitAngle, orbitRadius, orbitSpeed, verticalOffset] = stats;

    this.player = player;
    this.orbitAngle = orbitAngle;
    this.orbitRadius = orbitRadius;
    this.orbitSpeed = orbitSpeed;
    this.verticalOffset = verticalOffset;
    this.playAnimation(this.animations.idle);
  }

  public onUpdate(delta: number): void {
    if (!this.player || this.player.getDead()) return;

    this.characterSpeed?.update(delta);

    const playerX = this.player.x;
    const playerY = this.player.y - this.verticalOffset;

    this.orbitAngle += this.orbitSpeed * delta;
    if (this.orbitAngle >= Math.PI * 2) {
      this.orbitAngle -= Math.PI * 2;
    }

    const targetX = playerX + Math.cos(this.orbitAngle) * this.orbitRadius;
    const targetY = playerY + Math.sin(this.orbitAngle) * (this.orbitRadius * 0.4);

    const dx = targetX - this.character.x;
    const dy = targetY - this.character.y;

    const speed = this.characterSpeed?.velocity ?? 0;

    this.character.setVelocityX(Phaser.Math.Clamp(dx, -speed, speed));
    this.character.setVelocityY(Phaser.Math.Clamp(dy, -speed, speed));
  }

  public onExit(): void {}
}
