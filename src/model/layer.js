import * as THREE from 'three';
import { BlockModel, FallingBlockModel, PlacedBlockModel } from "./block";
import { MOVING_RANGE } from './constants';

export class LayerModel {
  fallingBlock = null;
  placedBlock = null;
  overlap = 0;
  isCuttingBehind = false;
  _initMovingBlockPosition = -MOVING_RANGE;

  constructor({
    scene,
    axis = 'x',
    width,
    depth,
    x = 0,
    y = 0,
    z = 0,
  }) {
    this._scene = scene;
    this.axis = axis;

    this.movingBlock = new BlockModel({
      width,
      depth,
      initPosition: new THREE.Vector3(
        this.isAxisX ? this._initMovingBlockPosition : x,
        y,
        this.isAxisZ ? this._initMovingBlockPosition : z
      ),
    });

    this._scene.add(this.movingBlock.mesh);
  }

  get isAxisX() {
    return this.axis === 'x';
  }

  get isAxisZ() {
    return this.axis === 'z';
  }

  _removeMovingBlock() {
    this._scene.remove(this.movingBlock?.mesh);
    this.movingBlock = null;
  }

  _createPlacedBlock() {
    this.placedBlock = new PlacedBlockModel(this);
    this._scene.add(this.placedBlock.mesh);
  }

  _createFallingBlock = (isLastFallingBlock) => {
    this.fallingBlock = new FallingBlockModel({ layer: this, isLastFallingBlock });
    this._scene.add(this.fallingBlock.mesh);
  };

  cut(prevPlacedBlock) {

    this.overlap = this.isAxisX
      ? this.movingBlock.width - Math.abs(this.movingBlock.mesh.position.x - prevPlacedBlock.mesh.position.x)
      : this.movingBlock.depth - Math.abs(this.movingBlock.mesh.position.z - prevPlacedBlock.mesh.position.z);

    if (this.overlap <= 0) {
      this._createFallingBlock(true);
      this._removeMovingBlock();

      return false;
    }

    this.isCuttingBehind =
      this.movingBlock.mesh.position[this.axis] - prevPlacedBlock.mesh.position[this.axis] < 0;

    this._createPlacedBlock();
    this._createFallingBlock();
    this._removeMovingBlock();

    return true;
  }

  clear() {
    this._removeMovingBlock();

    this._scene.remove(
      this.placedBlock?.mesh,
      this.fallingBlock?.mesh
    );

    this.placedBlock = null;
    this.fallingBlock = null;
  }
}
