import { QUEST_IDS } from '@/constants/quest-ids';
import { SaveService } from '@/infrastructure/save-service';

export class ScoreTracker {
  private get isLocked(): boolean {
    return SaveService.getQuestState(QUEST_IDS.MAIN_QUEST) === 'done';
  }

  public get dmgDone(): number {
    return SaveService.data.score.dmgDone;
  }

  public get dmgRecieved(): number {
    return SaveService.data.score.dmgRecieved;
  }

  public get enemiesDefeated(): number {
    return SaveService.data.score.enemiesDefeated;
  }

  public get goldEarned(): number {
    return SaveService.data.score.goldEarned;
  }

  public addDmgDone(amount: number): void {
    if (this.isLocked) return;
    SaveService.patch({
      score: { ...SaveService.data.score, dmgDone: this.dmgDone + amount },
    });
  }

  public addDmgRecieved(amount: number): void {
    if (this.isLocked) return;
    SaveService.patch({
      score: { ...SaveService.data.score, dmgRecieved: this.dmgRecieved + amount },
    });
  }

  public addEnemiesDefeated(amount: number): void {
    if (this.isLocked) return;
    SaveService.patch({
      score: { ...SaveService.data.score, enemiesDefeated: this.enemiesDefeated + amount },
    });
  }

  public addGoldEarned(amount: number): void {
    if (this.isLocked) return;
    SaveService.patch({
      score: { ...SaveService.data.score, goldEarned: this.goldEarned + amount },
    });
  }

  public reset(): void {
    if (this.isLocked) return;
    SaveService.patch({
      score: {
        dmgDone: 0,
        dmgRecieved: 0,
        enemiesDefeated: 0,
        goldEarned: 0,
      },
    });
  }
}
