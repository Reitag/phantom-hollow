import { DebuffFactory } from '@/factories/debuff-factory';
import { Debuff } from '@/modifiers/core/debuff';
import { Character } from '@/objects/core/character';

export class DebuffManager {
  private debuffs: Debuff[] = [];

  constructor(private scene: Phaser.Scene) {}

  public addDebuff(id: string): void {
    this.debuffs.push(DebuffFactory.create(this.scene, id));
  }

  public removeDebuff(id: string): void {
    this.debuffs = this.debuffs.filter((elem) => elem.id !== id);
  }

  public startDebuff(id: string, target: Character): void {
    const debuff = this.debuffs.find((debuff) => debuff.id === id);
    debuff?.start(target, () => this.removeDebuff(id));
  }

  public isDebuffExist(id: string): boolean {
    return this.debuffs.some((debuff) => debuff.id === id);
  }
}
