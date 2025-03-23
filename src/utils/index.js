import * as THREE from "three";
import { COLOR } from "../model/constants";

export const getLastBlockProps = (layer) => {
  return {
    width: layer.movingBlock.width,
    depth: layer.movingBlock.depth,
    initPosition: layer.movingBlock.mesh.position,
  };
};

export const calcFallingPosition = (layer, axisPosition) => {
  const shift = axisPosition + layer.overlap / 2;

  return layer.isCuttingBehind ? shift - layer.overlap : shift;
};

export const getFallingBlockProps = (layer) => {
  const props = {
    width: layer.isAxisX
      ? layer.movingBlock.width - layer.overlap
      : layer.movingBlock.width,
    depth: layer.isAxisZ
      ? layer.movingBlock.depth - layer.overlap
      : layer.movingBlock.depth,
  };

  const x = layer.isAxisX
    ? calcFallingPosition(layer, layer.movingBlock.mesh.position.x)
    : layer.movingBlock.mesh.position.x;

  const z = layer.isAxisZ
    ? calcFallingPosition(layer, layer.movingBlock.mesh.position.z)
    : layer.movingBlock.mesh.position.z;

  props.initPosition = new THREE.Vector3(
    x,
    layer.movingBlock.mesh.position.y,
    z
  );

  return props;
};

export const calcPlacedBlockShift = (sideSize, layer) => {
  const shift = (sideSize - layer.overlap) / 2;
  const sign = layer.isCuttingBehind ? 1 : -1;

  return shift * sign;
};

export const calcPlacedBlockProps = (layer) => {
  const width = layer.isAxisX ? layer.overlap : layer.movingBlock.width;
  const depth = layer.isAxisZ ? layer.overlap : layer.movingBlock.depth;

  const x = layer.isAxisX
    ? layer.movingBlock.mesh.position.x + calcPlacedBlockShift(layer.movingBlock.width, layer)
    : layer.movingBlock.mesh.position.x;

  const z = layer.isAxisZ
    ? layer.movingBlock.mesh.position.z + calcPlacedBlockShift(layer.movingBlock.depth, layer)
    : layer.movingBlock.mesh.position.z;

  return {
    width,
    depth,
    initPosition: new THREE.Vector3(x, layer.movingBlock.mesh.position.y, z),
    color: COLOR.placedBlock,
  };
};
