import { W, H, setStyle, random, randomf, createElement } from "./utils.js";
import { playSound, playWinSound } from "./sfx.js";

const DEBUG = true;
let cellSize;
let grid = [];
let input = [];
let n = 6;
const levels = {
  0: { n: 3, mines: 2 },
  1: { n: 6, mines: 8 },
  2: { n: 12, mines: 20 }
};
const screens = [...document.querySelectorAll(".screen")];
const GAME_STATES = {
  NOT_STARTED: "notStarted",
  STARTED: "started",
  ENDED: "ended"
};
let gameState = GAME_STATES.NOT_STARTED;
let currentScreen = "menu";
let startTime;
let entities = [];
let currentLevel;
const HIGHSCORE_KEY = "bms-high-score";
const LAST_SCORE_KEY = "bms-last-score";
let highScore = (window.localStorage.getItem(HIGHSCORE_KEY) &&
  JSON.parse(window.localStorage.getItem(HIGHSCORE_KEY))) || {
  0: 0,
  1: 0
};
let lastGameScore;
const sounds = {
  laser: [
    0,
    0,
    0.20186369123006712,
    0.08864788869394417,
    0.3533138312310672,
    0.730741378990208,
    0.2,
    -0.18340614838729788,
    0,
    0,
    0,
    0,
    0,
    0.13312363811900763,
    0.13711016008646912,
    0,
    0,
    0,
    1,
    0,
    0,
    0.1086867241891986,
    0,
    0.5
  ]
};

function updateScoreUi(score) {
  // easyHighScoreEl.textContent = highScore[0] ? `${highScore[0]}s` : "-";
  // hardHighScoreEl.textContent = highScore[1] ? `${highScore[1]}s` : "-";
}
function changeScreen(name) {
  screens.forEach(screen => screen.classList.remove("visible"));
  // document.querySelector(`[data-screen="${name}"]`).classList.add("visible");
  currentScreen = name;

  // cleanup
  hideMessage();

  // window.removeEventListener("keyup", gameStartTriggerHandler);
  // window.removeEventListener("click", gameStartTriggerHandler);

  if (name !== "game") {
    grid = [];
    input = [];
    // timeEl.textContent = "0";

    // Array.from(tileContainer.children).map(i => i.remove());
    gameState = GAME_STATES.NOT_STARTED;
  }
}

function logField(arr) {
  console.log("Field:");
  for (let y = 0; y < n; y++) {
    console.log(arr[y]);
    console.log("---");
  }
}

function makeTile({ isBomb }) {
  let el = document.createElement("div");
  // const isBomb = Math.random() > 0.5;
  const color = `rgb(${random(10, 255)}, 78, 45)`;

  const bomb = `
  <a-entity position="0 0 1" rotation="0 ${random(0, 360)} 0"
  >
      <a-sphere color="#222" metalness="1"  radius="0.7" position="0 0 0"></a-sphere>
      <a-cylinder color="#222" metalness="1" radius="0.31" height="0.26" position="0 0.7 0"></a-cylinder>
      <a-torus position="-0.44 0.5 0" color="#fff" arc="90" radius="0.5" radius-tubular="0.03"></a-torus>
  </a-entity>

  `;

  el.innerHTML = `
    <a-entity tile-listener>
        <a-box depth="2" width="2" height="2" color="#8BA069"
        animation="property: position.z; from:-3; to: 0; dur: 400; easing: easeInOutSine"
        animation__rot="property: rotation.z; from:130; to: 0; dur: 400; easing: easeInOutSine"

        animation__mouseenter="property: scale; to:1.1 1.1; startEvents: mouseenter; dur: 300; easing: easeInOutSine";
        animation__mouseenter-color="property: color; to: #fff; startEvents: mouseenter; dur: 300; easing: easeInOutSine";
        animation__mouseleave="property: scale; to:1 1; startEvents: mouseleave; dur: 300; easing: easeInOutSine";
        animation__mouseleavec-color="property: color; to: #8BA069; startEvents: mouseleave; dur: 300; easing: easeInOutSine";
        ></a-box>

        ${
          isBomb
            ? bomb
            : '<a-text data-id="count" color="#000" position="-0.35 0 1.08" width="20" value="0"></a-text>'
        }

    </a-entity>
    `;
  el = el.children[0];
  el.count = 0;
  el.tileType = isBomb ? "bomb" : "tile";
  // document.querySelector("#tileContainer").append(el);
  return el;
}
function createGrid() {
  for (let i = 9; i--; ) {
    setTimeout(() => {
      addTile();
    }, i * 100);
  }
}
function blast(position) {
  console.log(position);
  const scene = document.querySelector("a-scene");
  for (let i = random(5, 10); i--; ) {
    let el = document.createElement("div");
    let radius = Math.random() * 0.1;
    el.innerHTML = `
    <a-sphere radius="${radius}" color="yellow" position="${position.x +
      Math.random() * 0.1} ${position.y + Math.random() * 0.1} ${position.z +
      Math.random() * 0.1}" blast-particle></a-sphere>
    `;
    el = el.children[0];
    scene.append(el);
  }
}
AFRAME.registerComponent("tile-listener", {
  init: function() {
    var el = this.el;
    if (el.tileType !== "bomb") {
      el.addEventListener("click", function(evt) {
        // console.log(el.getAttribute("position"), 9, el.object3D.position);
        blast(el.object3D.getWorldPosition());
        // el.querySelector('[data-id="count"]').setAttribute("value", ++el.count);
        setTileValue(el);
      });
    }
  }
});
AFRAME.registerComponent("blast-particle", {
  init: function() {
    var el = this.el;

    const pos = document.querySelector("a-camera").object3D.getWorldPosition();

    this.targetPosition = new THREE.Vector3(
      pos.x + randomf(-2, 2),
      pos.y + randomf(-2, 2),
      pos.z
    );
    this.directionVec3 = new THREE.Vector3();
    this.speed = 10;
  },
  tick: function(time, timeDelta) {
    var directionVec3 = this.directionVec3;

    // Grab position vectors (THREE.Vector3) from the entities' three.js objects.
    var targetPosition = this.targetPosition;
    var currentPosition = this.el.object3D.position;

    // Subtract the vectors to get the direction the entity should head in.
    directionVec3.copy(targetPosition).sub(currentPosition);

    // Calculate the distance.
    var distance = directionVec3.length();

    // Don't go any closer if a close proximity has been reached.
    if (distance < 0.1) {
      this.el.remove();
      return;
    }

    // Scale the direction vector's magnitude down to match the speed.
    var factor = this.speed / distance;
    ["x", "y", "z"].forEach(function(axis) {
      directionVec3[axis] *= factor * (timeDelta / 1000);
    });

    // console.log(directionVec3);

    // Translate the entity in the direction towards the target.
    this.el.setAttribute("position", {
      x: currentPosition.x + directionVec3.x,
      y: currentPosition.y + directionVec3.y,
      z: currentPosition.z + directionVec3.z
    });
  }
});

AFRAME.registerComponent("win-blast-particle", {
  init: function() {
    var el = this.el;

    const pos = el.object3D.getWorldPosition();

    this.targetPosition = new THREE.Vector3(pos.x, 0, pos.z);
    this.directionVec3 = new THREE.Vector3();
    this.speed = 5;
  },
  tick: function(time, timeDelta) {
    var directionVec3 = this.directionVec3;
    const rot = this.el.object3D.rotation;

    // Grab position vectors (THREE.Vector3) from the entities' three.js objects.
    var targetPosition = this.targetPosition;
    var currentPosition = this.el.object3D.position;

    // Subtract the vectors to get the direction the entity should head in.
    directionVec3.copy(targetPosition).sub(currentPosition);

    // Calculate the distance.
    var distance = directionVec3.length();

    // Don't go any closer if a close proximity has been reached.
    if (distance < 0.1) {
      this.el.remove();
      return;
    }

    // Scale the direction vector's magnitude down to match the speed.
    var factor = this.speed / distance;
    ["x", "y", "z"].forEach(function(axis) {
      directionVec3[axis] *= factor * (timeDelta / 1000);
    });

    // console.log(directionVec3);

    // Translate the entity in the direction towards the target.
    this.el.setAttribute("position", {
      x: currentPosition.x + directionVec3.x,
      y: currentPosition.y + directionVec3.y,
      z: currentPosition.z + directionVec3.z
    });

    // Translate the entity in the direction towards the target.
    this.el.setAttribute("rotation", {
      x: rot.x,
      y: rot.y + randomf(-10, 10) * timeDelta,
      z: rot.z + randomf(-10, 10) * timeDelta
    });
  }
});

AFRAME.registerComponent("cursor-listener", {
  init: function() {
    var el = this.el;
    el.addEventListener("click", function(evt) {
      setupGame();
    });
  }
});

function gen(level, container = window.tileContainer) {
  n = levels[level].n;
  const numMines = levels[level].mines;
  cellSize = ~~((Math.min(W, H) * 0.014) / n);
  document.documentElement.style.setProperty("--unit", `${cellSize}px`);
  setStyle(container, {
    // left: `${cellSize * n * 0.15}px`,
    width: `${cellSize * n}px`,
    height: `${cellSize * n}px`
  });
  let minesPos = [];
  while (minesPos.length < numMines) {
    let cellIndex = random(0, n * n);
    if (!minesPos.includes(cellIndex)) {
      minesPos.push(cellIndex);
    }
  }
  minesPos = minesPos.map(pos => {
    return { y: ~~(pos / n), x: pos % n };
  });

  Array.from(container.children).map(i => i.remove());
  grid = [];
  for (var i = 0; i < n; i++) {
    grid[i] = [];
    input[i] = [];
    for (var j = 0; j < n; j++) {
      grid[i][j] = 0;
      input[i][j] = 0;
    }
  }
  for (var j = 0; j < n; j++)
    for (var i = 0; i < n; i++) {
      const t = makeTile({
        isBomb: minesPos.some(pos => pos.x === i && pos.y === j)
      });

      t.setAttribute("position", `${i * cellSize} ${j * cellSize} 0`);
      t.count = 0;
      t.posX = i;
      t.posY = j;

      if (t.tileType === "bomb") {
        grid[i][j] = -1;
        // iterate around the current cell (i,j)
        for (let x = -1; x <= 1; x++)
          for (let y = -1; y <= 1; y++) {
            if (
              (x === 0 && y === 0) ||
              i + x < 0 ||
              j + y < 0 ||
              i + x > n - 1 ||
              j + y > n - 1 ||
              grid[i + x][j + y] === -1
            )
              continue;
            grid[i + x][j + y] = grid[i + x][j + y] + 1;
          }
      }

      container.append(t);
    }
}

function checkWin() {
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n + 1; j++) {
      if (grid[i][j] === -1) continue;

      if (grid[i][j] !== input[i][j]) {
        return false;
      }
    }
  }
  return true;
}
function wait(duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  });
}

async function showMessage(msg) {
  const el = createElement("div", "message");
  el.setAttribute("role", "alert");
  document.body.append(el);
  el.innerHTML = `<div class="message__text">${msg}</div>`;

  await wait(10);
  document.body.classList.add("message-anim-1");
  await wait(430);
  document.body.classList.add("message-anim-2");
  playSound("powerup");
}
async function hideMessage() {
  document.body.classList.remove("message-anim-2");
  if (document.querySelector(".message")) {
    document.querySelector(".message").remove();
  }
  document.body.classList.remove("message-anim-1");
}
function setupGame(e, level = 0) {
  if (e) {
    level = parseInt(e.currentTarget.dataset.level, 10);
    e.stopPropagation();
  }
  currentLevel = level;
  gen(level);
  // rotateCamera();
  changeScreen("game");
  startGame();

  // showMessage("Click/Tap anywhere or press any key to start").then(() => {
  //   window.addEventListener("keyup", gameStartTriggerHandler, { once: true });
  //   window.addEventListener("click", gameStartTriggerHandler, { once: true });
  // });
}

function gameStartTriggerHandler() {
  if (gameState === GAME_STATES.NOT_STARTED) {
    startGame();
  }
}

async function startGame() {
  hideMessage();
  // const bombs = Array.from(document.querySelectorAll(".tile.hole"));

  document.body.classList.add("bomb-place-anim-1");

  /*  bombs.forEach(bomb => {
    setTimeout(() => {
      playSound("laser");
    }, random(0, 600));
  }); */

  shake({ time: 0.5 });

  gameState = GAME_STATES.STARTED;
  startTime = Date.now();
}

function setTileValue(el, value, diff = 1) {
  if (gameState !== GAME_STATES.STARTED) return;

  input[el.posX][el.posY] =
    value !== undefined ? value : input[el.posX][el.posY] + diff;
  input[el.posX][el.posY] %= 9;
  if (input[el.posX][el.posY] < 0) {
    input[el.posX][el.posY] = 8;
  }
  // el.textContent = [1, 2, 3, 4, 5, 6, 7, 8][input[el.posX][el.posY] - 1];
  el.querySelector('[data-id="count"]').setAttribute(
    "value",
    input[el.posX][el.posY]
  );

  // setTileLabel(el, el.posY + 1, el.posX + 1, input[el.posX][el.posY]);

  // shake tile
  shake({ time: 0.3, el, shakeIntensity: 5 });

  playSound("hit");

  console.log(grid, input);
  if (checkWin()) {
    const time = (Date.now() - startTime) / 1000;
    gameState = GAME_STATES.ENDED;
    document
      .querySelector("#score-element")
      .setAttribute("value", `You won in ${time.toFixed(1)} seconds!`);

    winBlast();
    playWinSound();
    saveScores(time);
  }
}

async function winBlast() {
  let position = document
    .querySelector("#tileContainer")
    .object3D.getWorldPosition();

  const scene = document.querySelector("a-scene");
  for (let i = random(20, 70); i--; ) {
    let el = document.createElement("div");
    let radius = Math.random() * 0.1;
    el.innerHTML = `
      <a-plane color="rgb(${random(10, 255)},${random(10, 255)},${random(
      10,
      255
    )})" width="0.2" height="0.2" position="${position.x +
      randomf(-7, 7)} ${position.y + 10} ${position.z +
      randomf(-7, 7)}" win-blast-particle></a-plane>
      `;
    el = el.children[0];
    scene.append(el);
  }

  playSound("winExplosion");
  await wait(500);

  playSound("winExplosion");

  await wait(1500);
  playSound("winExplosion");
}

function navigate(el, dir) {
  function getVerticalEl(el, x, y) {
    return el.parentElement.children[y * n + x];
  }

  if (dir === "right" || dir === "left") {
    let nextEl = el;
    const fnName =
      dir === "right" ? "nextElementSibling" : "previousElementSibling";
    while (
      (nextEl = nextEl[fnName]
        ? nextEl[fnName]
        : el.parentElement.children[dir === "right" ? 0 : n * n - 1])
    ) {
      if (!nextEl.className.match(/cover/)) {
        break;
      }
    }
    nextEl.focus();
  } else if (dir === "up" || dir === "down") {
    let nextEl = el;
    const diff = dir === "down" ? 1 : -1;
    while (
      (nextEl =
        nextEl.posY + diff < n && nextEl.posY + diff >= 0
          ? getVerticalEl(nextEl, nextEl.posX, nextEl.posY + diff)
          : getVerticalEl(nextEl, nextEl.posX, dir === "down" ? 0 : n - 1))
    ) {
      if (!nextEl.className.match(/cover/)) {
        break;
      }
    }
    nextEl.focus();
  }
}

function shake({ time, el = document.body, shakeIntensity = 15 }) {
  let shakeTime = time;
  function shakeRepeater() {
    shakeTime -= 1 / 60;
    // el.style.left = `${random(-shakeIntensity, shakeIntensity)}px`;
    // el.style.top = `${random(-shakeIntensity, shakeIntensity)}px`;
    el.style.transform = `translate(${random(
      -shakeIntensity,
      shakeIntensity
    )}px,${random(-shakeIntensity, shakeIntensity)}px)`;

    if (shakeTime > 0) {
      requestAnimationFrame(shakeRepeater);
    } else {
      el.style.transform = null;

      // el.style.marginLeft = null;
      // el.style.marginTop = null;
    }
  }
  shakeRepeater();
}

function menuBombBlast(bomb) {
  const bound = bomb.getBoundingClientRect();

  for (let i = random(5, 20); i--; ) {
    entities.push(
      new Particle({
        height: random(5, 15),
        width: random(5, 15),
        x: random(bound.left, bound.left + bound.width),
        y: random(bound.top, bound.top + bound.height),
        vx: random(-10, 10),
        vy: -random(20, 55),
        isConfetti: true,
        gravity: 0.4,
        friction: 0.88,
        alphaSpeed: -0.025,
        scale: 0.3 + Math.random(0, 1),
        angularSpeed: { x: random(-5, 5), y: 0, z: 0 },
        color: "yellow",
        timeToDie: 0.7
      })
    );
  }
}
function saveScores(score) {
  if (score < highScore[currentLevel] || !highScore[currentLevel]) {
    highScore[currentLevel] = score;
    window.localStorage.setItem(HIGHSCORE_KEY, JSON.stringify(highScore));
    updateScoreUi();
  }
  lastGameScore = score;
}

function gameLoop() {
  const now = Date.now();

  if (currentScreen === "menu" && Math.random() < 0.005) {
    entities.push(
      new Bomb({
        x: random(0, W),
        y: random(0, H / 2)
      })
    );
  }

  if (gameState === GAME_STATES.STARTED) {
    const time = (~~(now - startTime) / 1000).toFixed(1);
    window.timeEl.textContent = time;
  }
  entities.map(e => {
    e.update();
    e.draw();
    if (e.hasHitEnd && e.hasHitEnd()) {
      e.dead = true;

      if (e.type === "bomb") {
        menuBombBlast(e.el);
      }
      e.destroy();
    }
  });
  entities = entities.filter(e => !e.dead);
  requestAnimationFrame(gameLoop);
}

function init() {
  // menu gameboard
  // gen(0, window.menuTileContainer, true);
  // gameLoop();
  window.setupGame = setupGame;
  window.changeScreen = changeScreen;
}
// playWinSound();

init();
