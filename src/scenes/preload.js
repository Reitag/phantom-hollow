import Phaser from "phaser";

import { registerGlobalAnimation } from "../data/animation-loader";

const packs = [
  { key: "tilesets-pack", url: "src/data/tilesets.json" },
  { key: "objects-pack", url: "src/data/objects.json" },
  { key: "maps-pack", url: "src/data/maps.json" },
  { key: "ui-pack", url: "src/data/ui.json" },
  { key: "characters-pack", url: "src/data/characters.json" },
  { key: "spells-pack", url: "src/data/spells.json" },
  { key: "misc-pack", url: "src/data/misc.json" },
];

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }
  preload() {
    //this.load.pack('PreloadScene', 'src/data/game-preload.json');
    for (const path of packs) {
      const { key, url } = path;
      this.load.pack(key, url);
    }
  }
  create() {
    registerGlobalAnimation(this.anims);
    this.scene.start("LevelOneScene");
  }
}
