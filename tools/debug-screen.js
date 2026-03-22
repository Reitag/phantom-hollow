export class DebugScreen extends Phaser.Scene {
  constructor() {
    super('DebugScreen');

    this.fps = 0;
    this.jsHeap = 'N/A';
    this.texMB = 'N/A';
    this.textureCount = 0;
    this.drawCalls = 0;
    this.visible = true;

    // Custom counters
    this.totalObjects = 0;
    this.totalBodies = 0;

    // Player's coordinates
    this.coords = {
      x: null,
      y: null,
    };
  }

  setPlayersCoords(x, y) {
    this.coords = {
      x: Math.round(x),
      y: Math.round(y),
    };
  }

  create() {
    const gl = this.sys.game.renderer.gl;

    ['drawArrays', 'drawElements'].forEach((fn) => this.wrapDrawCall(gl, fn));

    // compact panel size
    const x = 0;
    const y = 100;

    // debug text
    this.text = this.add
      .text(x + 8, y + 8, '', {
        fontFamily: 'Consolas, monospace',
        fontSize: '13px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
        resolution: 1,
        align: 'left',
        backgroundColor: '#00000090',
        lineSpacing: 8,
      })
      .setDepth(1000);

    // toggle key
    this.input.keyboard.on('keydown-M', () => {
      this.visible = !this.visible;
      this.text.setVisible(this.visible);
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
      this.jsHeap = `\n  Used: ${usedMB.toFixed(2)} MB\n  Total: ${totalMB.toFixed(2)} MB\n  Limit: ${limitMB.toFixed(2)} MB`;
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
    const sceneStats = scenes.map((s) => {
      const key = s.sys.settings.key;
      const objects = s.sys.displayList.length;
      const bodies = s.physics?.world?.bodies?.entries.length || 0;
      const events = s.events.eventNames();
      return { key, objects, bodies, events };
    });

    const sceneLines = sceneStats.map(
      (s) => `  ${s.key}: obj=${s.objects}, bodies=${s.bodies}, events=${s.events.length}`
    );

    // display info
    this.text.setText([
      `FPS: ${this.fps}`,
      `RAM: ${this.jsHeap}`,
      `Textures: ${this.texMB} (${this.textureCount})`,
      `Player's coords: x: ${this.coords.x}, y: ${this.coords.y}`,
      `Draw calls: ${this.drawCalls}`,
      `Scenes: `,
      ...sceneLines,
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
