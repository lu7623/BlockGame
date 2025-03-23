import * as THREE from "three";
import { BASE_BLOCK_SIZE, COLOR } from "./constants";
import {
  calcPlacedBlockProps,
  getFallingBlockProps,
  getLastBlockProps,
} from "../utils";

export class BlockModel {
  constructor({
    width,
    height = BASE_BLOCK_SIZE.height,
    depth,
    initPosition = new THREE.Vector3(0, 0, 0),
    color = COLOR.movingBlock,
  }) {
    this.width = width;
    this.height = height;
    this.depth = depth;

    this.geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
    this.material = new THREE.MeshLambertMaterial({ color });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(...initPosition);
  }
}

export class FallingBlockModel extends BlockModel {
  constructor({ layer, isLastFallingBlock }) {
    const props = isLastFallingBlock
      ? getLastBlockProps(layer)
      : getFallingBlockProps(layer);

    props.color = COLOR.fallingBlock;

    super(props);
  }

  tick(delta) {
    this.mesh.position.y -= delta * 25;
  }
}

export class PlacedBlockModel extends BlockModel {
  constructor(layer) {
    const props = calcPlacedBlockProps(layer);

    super(props);
  }
}
