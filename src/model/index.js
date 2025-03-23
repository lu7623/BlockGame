import * as THREE from "three";
import { Stage } from "./stage";
import { Tower } from "./tower";

export class Game {
  canvas = document.querySelector("#canvas");
  board = document.body.querySelector(".board");
  restartButton = document.body.querySelector("#button");
  clock = new THREE.Clock();
  _prevTimer = 0;
  _isGameOver = false;

  constructor() {
    this.stage = new Stage(this.canvas);

    this.tower = new Tower({
      stage: this.stage,
      onFinish: () => this.end(),
    });

    this._init();
  }

  _init() {
    this.tick();

    this.canvas.addEventListener("click", () => {
      if (this._isGameOver) {
        return;
      }

      this.tower.place();
    });

    this.restartButton.addEventListener("click", () => this.restart());
  }

  tick() {
    const elapsedTime = this.clock.getElapsedTime();
    const delta = elapsedTime - this._prevTimer;
    this._prevTimer = elapsedTime;

    this.tower.tick(delta);
    this.stage.renderFrame();

    requestAnimationFrame(() => this.tick());
  }

  end() {
    this._isGameOver = true;
    this.board.style.display = "flex";
  }

  restart() {
    this.stage.camera.resetPosition();
    this.tower.reset();
    this._isGameOver = false;
    this.board.style.display = "none";
  }
}
