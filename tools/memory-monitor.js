import Phaser from 'phaser';

export class MemoryMonitor extends Phaser.Scene {
  constructor() {
    super('MemoryMonitor');

    this.fps = 0;
    this.jsHeap = 'N/A';
    this.texMB = 'N/A';
    this.textureCount = 0;
    this.drawCalls = 0;
    this.visible = true;

    // Custom counters
    this.totalObjects = 0;
    this.totalBodies = 0;
    this.totalSpells = 0; // increment when creating/destroying spells
  }

  create() {
    const gl = this.sys.game.renderer.gl;

    ['drawArrays', 'drawElements'].forEach((fn) => this.wrapDrawCall(gl, fn));

    // background rectangle
    this.bg = this.add.rectangle(5, 35, 550, 220, 0x000000, 0.5).setOrigin(0, 0).setDepth(999);

    // debug text
    this.text = this.add
      .text(10, 45, '', {
        fontFamily: 'Consolas, Courier, monospace',
        fontSize: '16px',
        color: '#00ff00',
        stroke: '#000000',
        strokeThickness: 2,
        align: 'left',
        resolution: 2,
      })
      .setDepth(1000);

    // toggle key
    this.input.keyboard.on('keydown-M', () => {
      this.visible = !this.visible;
      this.text.setVisible(this.visible);
      this.bg.setVisible(this.visible);
    });

    const renderer = this.sys.game.renderer;
    renderer.on('prerender', () => (this.drawCalls = 0));
  }

  update() {
    this.fps = Math.round(this.game.loop.actualFps);

    // memory
    if (performance.memory) {
      const mem = performance.memory;
      const usedMB = mem.usedJSHeapSize / 1048576;
      const totalMB = mem.totalJSHeapSize / 1048576;
      const limitMB = mem.jsHeapSizeLimit / 1048576;
      this.jsHeap = `Used: ${usedMB.toFixed(2)} MB / Total: ${totalMB.toFixed(2)} MB / Limit: ${limitMB.toFixed(2)} MB`;
    }

    // textures
    let totalTextureBytes = 0;
    this.textureCount = 0;
    Object.values(this.game.textures.list).forEach((tex) => {
      const sources = tex.getSourceImage();
      if (Array.isArray(sources)) {
        sources.forEach((img) => {
          if (img?.width && img?.height) {
            totalTextureBytes += img.width * img.height * 4;
            this.textureCount++;
          }
        });
      } else if (sources?.width && sources?.height) {
        totalTextureBytes += sources.width * sources.height * 4;
        this.textureCount++;
      }
    });
    this.texMB = (totalTextureBytes / 1048576).toFixed(2) + ' MB';

    // game objects & physics bodies
    const scenes = this.game.scene.getScenes(true);
    this.totalObjects = scenes.map((s) => s.sys.displayList.length).reduce((sum, n) => sum + n, 0);

    this.totalBodies = scenes
      .map((s) => s.physics?.world?.bodies?.entries.length || 0)
      .reduce((sum, n) => sum + n, 0);

    // display info
    this.text.setText([
      `FPS: ${this.fps}`,
      `RAM: ${this.jsHeap}`,
      `Textures: ${this.texMB} (${this.textureCount})`,
      `Draw calls: ${this.drawCalls}`,
      `Objects (all scenes): ${this.totalObjects}`,
      `Physics bodies (all scenes): ${this.totalBodies}`,
      `Spells (custom counter): ${this.totalSpells}`,
      `Scenes: ${scenes.map((s) => s.sys.settings.key).join(', ')}`,
      'Press [M] to toggle',
    ]);
  }

  wrapDrawCall(gl, functionName) {
    const originalFunction = gl[functionName];
    if (!originalFunction) return;

    gl[functionName] = (...args) => {
      this.drawCalls++;
      return originalFunction.apply(gl, args);
    };
  }
}
