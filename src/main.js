import { Game } from './model';
import './style.css'

document.querySelector('#app').innerHTML = `
    <canvas id="canvas"></canvas>
      <div class="board">
        <p>Game Over</p>
        <button id="button">Restart</button>
      </div>
`

new Game();