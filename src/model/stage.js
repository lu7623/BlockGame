import * as THREE from "three";
import { CameraModel } from "./camera";
import { COLOR } from "./constants";

export class Stage {
  sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  scene = new THREE.Scene();

  ambientLight = new THREE.AmbientLight("white", 2);
  directionalLight = new THREE.DirectionalLight("white", 2);

  constructor(canvas) {
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.camera = new CameraModel(this);
    this._onResizeBound = this._onResize.bind(this);

    this._init();
  }

  get aspectRatio() {
    return this.sizes.width / this.sizes.height;
  }

  _init() {
    this.scene.background = new THREE.Color(COLOR.background);

    this.directionalLight.position.set(10, 18, 6);
    this.scene.add(this.directionalLight, this.ambientLight);

    const axesHelper = new THREE.AxesHelper(20);
    const lightHelper = new THREE.DirectionalLightHelper(this.directionalLight);

    this.scene.add(lightHelper, axesHelper);
    this._updateRenderer();

    window.addEventListener("resize", this._onResizeBound);
  }

  _onResize() {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;
    this.camera.update();
    this._updateRenderer();
  }

  _updateRenderer() {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  renderFrame() {
    this.renderer.render(this.scene, this.camera.instance);
  }

  destroy() {
    window.removeEventListener("resize", this._onResizeBound);
  }
}
