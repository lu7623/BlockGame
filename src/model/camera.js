import * as THREE from 'three';
import { gsap } from "gsap";

export class CameraModel {

  _viewDistance = 20;
  _near = 0.1;
  _far = 100;
  _initialPosition = new THREE.Vector3(30, 30, 30);

  constructor(stage) {
    this._stage = stage;

    this.instance = new THREE.OrthographicCamera(
      this._viewDistance * -1 * this._stage.aspectRatio,
      this._viewDistance * this._stage.aspectRatio,
      this._viewDistance,
      this._viewDistance * -1,
      this._near,
      this._far,
    );

    this._init();
  }

  _init() {
    this.resetPosition();
    this.instance.lookAt(0, 0, 0);

    this._stage.scene.add(this.instance);
  }

  update() {
    this.instance.left = this._viewDistance * -1 * this._stage.aspectRatio;
    this.instance.right = this._viewDistance * this._stage.aspectRatio;

    this.instance.updateProjectionMatrix()
  }

  syncPosition({ x, y, z }) {
    gsap.to(this.instance.position, {
      ease: 'expo.out',
      duration: 1,
      x: this._initialPosition.x + x,
      y: this._initialPosition.y + y,
      z: this._initialPosition.z + z,
    });
  }

  resetPosition() {
    this.instance.position.set(...Object.values(this._initialPosition));
  }
}
