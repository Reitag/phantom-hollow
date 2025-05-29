export class Tilemap {
  constructor(scene, mapKey, tilesetsConfig = [], layersConfig = []) {
    this.scene = scene;
    this.mapKey = mapKey;
    this.tilesetsConfig = tilesetsConfig;
    this.layersConfig = layersConfig;

    this.map = null;
    this.tilesets = {};
    this.layers = {};
  }

  create() {
    this.map = this.scene.make.tilemap({ key: this.mapKey });

    this.tilesetsConfig.forEach(({ name, key }) => {
      this.tilesets[name] = this.map.addTilesetImage(name, key);
    });

    this.layersConfig.forEach(({ name, tilesets: tsNames, x, y, collide }) => {
      const tsObjects = tsNames.map((ts) => this.tilesets[ts]).filter(Boolean);
      this.layers[name] = this.map.createLayer(name, tsObjects, x, y);

      if (collide) {
        this.layers[name].setCollisionByProperty({ collides: true });
      }
    });

    const { widthInPixels, heightInPixels } = this.map;
    this.scene.cameras.main.setBounds(0, 0, widthInPixels, heightInPixels);

    return this;
  }

  getLayer(name) {
    return this.layers[name] || null;
  }

  getMap() {
    return this.map;
  }
}
