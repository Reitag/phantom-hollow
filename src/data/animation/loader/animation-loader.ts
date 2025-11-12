import { playerAnim } from '../characters/player/player-anim';
import { fireballAnim } from '../spells/fire-ball-anim';
import { blinkAnim } from '../spells/blink-anim';
import { windAnim } from '../spells/wind-anim';
import { shadowboltAnim } from '../spells/shadowbolt-anim';
import { skeletonwarriorAnim } from '../characters/enemies/skeleton-warrior-anim';
import { zombieAnim } from '../characters/enemies/zombie-anim';
import { mutadedbatAnim } from '../characters/enemies/mutaded-bat-anim';
import { evilwizardAnim } from '../characters/bosses/evil-wizard-anim';
import { itemsAnim } from '../items/items-anim';
import { portalAnim } from '../misc/portal-anim';
import { archerAnim } from '../characters/enemies/archer-anim';
import { darkEnergyAnim } from '../misc/dark-energy-anim';
import { fireWormAnim } from '../characters/bosses/fire-worm-anim';
import { frostboltAnim } from '../spells/frost-bolt-anim';
import { freezeAnim } from '../effects/freeze-anim';
import { soulFireAnim } from '../misc/soul-fire-anim';
import { lightningShieldAnim } from '../spells/lightning-shield-anim';

export function registerGlobalAnimation(anims: Phaser.Animations.AnimationManager) {
  // Player
  playerAnim(anims);

  // Spells
  fireballAnim(anims);
  blinkAnim(anims);
  lightningShieldAnim(anims);
  windAnim(anims);
  shadowboltAnim(anims);
  frostboltAnim(anims);

  // Enemies
  skeletonwarriorAnim(anims);
  zombieAnim(anims);
  mutadedbatAnim(anims);
  archerAnim(anims);

  // Bosses
  evilwizardAnim(anims);
  fireWormAnim(anims);

  // Items
  itemsAnim(anims);

  // Effects
  freezeAnim(anims);

  // Misc
  soulFireAnim(anims);
  portalAnim(anims);
  darkEnergyAnim(anims);
}
