import { BlockModel } from "./block";
import { BASE_BLOCK_SIZE, COLOR, MOVING_RANGE, SPEED_FACTOR } from "./constants";
import { LayerModel } from "./layer";

export class Tower {
  layers = [];
  _direction = 1;
  baseBlock = new BlockModel({
    ...BASE_BLOCK_SIZE,
    color: COLOR.baseBlock,
  });

  constructor({ stage, onFinish }) {
    this._stage = stage;
    this._finish = onFinish;
    this._init();
  }

  get activeLayerIndex() {
    return this.layers.length - 1;
  }

  get activeLayer() {
    return this.layers[this.activeLayerIndex];
  }

  get prevLayer() {
    return this.layers[this.activeLayerIndex - 1];
  }

  get lastPlacedBlock() {
    return this.prevLayer?.placedBlock ?? this.baseBlock;
  }

  _init() {
    this._stage.scene.add(this.baseBlock.mesh);
    this._addFirstLayer();
  }

  _reverseDirection() {
    this._direction = this._direction * -1;
  }

  _addFirstLayer() {
    const layer = new LayerModel({
      scene: this._stage.scene,
      width: BASE_BLOCK_SIZE.width,
      depth: BASE_BLOCK_SIZE.depth,
      y: BASE_BLOCK_SIZE.height,
    });

    this.layers.push(layer);
  }

  _addLayer() {
    const layer = new LayerModel({
      scene: this._stage.scene,
      axis: this.activeLayer.isAxisX ? "z" : "x",
      width: this.activeLayer.placedBlock.width,
      depth: this.activeLayer.placedBlock.depth,
      x: this.activeLayer.placedBlock.mesh.position.x,
      y: (this.activeLayerIndex + 2) * BASE_BLOCK_SIZE.height,
      z: this.activeLayer.placedBlock.mesh.position.z,
    });

    this.layers.push(layer);

    this._stage.camera.syncPosition(this.lastPlacedBlock.mesh.position);
  }

  tick(delta) {
    this.layers.forEach((layer) => layer.fallingBlock?.tick(delta));

    if (!this.activeLayer.movingBlock) {
      return;
    }

    const activeAxisPosition =
      this.activeLayer.movingBlock.mesh.position[this.activeLayer.axis];

    if (activeAxisPosition > MOVING_RANGE) {
      this.activeLayer.movingBlock.mesh.position[this.activeLayer.axis] =
        MOVING_RANGE;

      this._reverseDirection();
    }

    if (activeAxisPosition < -MOVING_RANGE) {
      this.activeLayer.movingBlock.mesh.position[this.activeLayer.axis] =
        -MOVING_RANGE;

      this._reverseDirection();
    }

    this.activeLayer.movingBlock.mesh.position[this.activeLayer.axis] +=
      delta * SPEED_FACTOR * this._direction;
  }

  place() {
    const result = this.activeLayer.cut(this.lastPlacedBlock);

    if (result) {
      this._addLayer();
      return;
    }

    this._finish();
  }

  reset() {
    this._direction = 1;
    this.layers.forEach((layer) => layer.clear());
    this.layers = [];
    this._addFirstLayer();
  }
}
