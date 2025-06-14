export class Tilemap {
  constructor(
    scene,
    mapKey,
    tilesetsConfig = [],
    tileLayersConfig = [],
    objectLayersConfig = [],
    layerDepths = {}
  ) {
    this.scene = scene;
    this.mapKey = mapKey;
    this.tilesetsConfig = tilesetsConfig;
    this.tileLayersConfig = tileLayersConfig;
    this.objectLayersConfig = objectLayersConfig;
    this.layerDepths = layerDepths;

    this.map = null;
    this.tilesets = {};
    this.tileLayers = {};
    this.objectLayers = {};
  }

  create() {
    this.map = this.scene.make.tilemap({ key: this.mapKey });

    this.tilesetsConfig.forEach(({ name, key }) => {
      this.tilesets[name] = this.map.addTilesetImage(name, key);
    });

    this.tileLayersConfig.forEach(
      ({ name, tilesets: tsNames, x, y, collide }) => {
        const tsObjects = tsNames
          .map((ts) => this.tilesets[ts])
          .filter(Boolean);
        this.tileLayers[name] = this.map.createLayer(name, tsObjects, x, y);
        this.tileLayers[name].setDepth(this.layerDepths[name] ?? 0);

        if (collide) {
          this.tileLayers[name].setCollisionByProperty({ collides: true });
        }
      }
    );

    this.objectLayersConfig.forEach(({ name, render }) => {
      const objectLayer = this.map.getObjectLayer(name);
      if (!objectLayer) {
        console.warn(`Object layer "${name}" not found`);
        return;
      }

      this.objectLayers[name] = objectLayer;

      if (typeof render === "function") {
        const layerDepth = this.layerDepths[name] ?? 0;
        objectLayer.objects.forEach((obj) => {
          render.call(this.scene, obj, layerDepth);
        });
      }
    });

    const { widthInPixels, heightInPixels } = this.map;
    this.scene.cameras.main.setBounds(0, 0, widthInPixels, heightInPixels);

    return this;
  }

  getObjectLayer(name) {
    return this.objectLayers[name] || null;
  }

  getTileLayer(name) {
    return this.tileLayers[name] || null;
  }

  getMap() {
    return this.map;
  }
}
