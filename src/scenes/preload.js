import Phaser from "phaser";

import { registerGlobalAnimation } from "../data/animation-loader";

export class PreloadScene extends Phaser.Scene {
  constructor(){
    super("PreloadScene");
  }
  preload(){
    this.load.pack('PreloadScene', 'src/data/game-preload.json');
  }
  create(){
    registerGlobalAnimation(this.anims);
    this.scene.start("LevelOneScene");
  }
}
