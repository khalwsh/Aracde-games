const arenaWidth = 12;
const arenaHeight = 20;
const colors = [
  null,
  '#FF0D72',
  '#0DC2FF',
  '#0DFF72',
  '#F538FF',
  '#FF8E0D',
  '#FFE138',
  '#3877FF',
];

let arena = createMatrix(arenaWidth, arenaHeight);
let player = { pos: {x:0,y:0}, matrix: null, score: 0 };

const arenaDiv = document.getElementById('arena');
const scoreDiv = document.getElementById('score');

// Build grid cells
function initGrid() {
  arenaDiv.innerHTML = '';
  for (let i = 0; i < arenaWidth * arenaHeight; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    arenaDiv.appendChild(cell);
  }
}

// Helpers
function createMatrix(w, h) {
  return Array.from({length: h}, () => Array(w).fill(0));
}

function draw() {
  // flatten arena + player into one 2D array
  const display = arena.map(row => row.slice());
  player.matrix.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val !== 0 && display[y + player.pos.y]) {
        display[y + player.pos.y][x + player.pos.x] = val;
      }
    });
  });

  // update each .cell
  const cells = arenaDiv.children;
  display.flat().forEach((val, idx) => {
    const cell = cells[idx];
    cell.style.backgroundColor = val ? colors[val] : '#000';
  });
}

function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y=0; y<m.length; y++) {
    for (let x=0; x<m[y].length; x++) {
      if (m[y][x] !== 0 &&
          (arena[y+o.y] && arena[y+o.y][x+o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = val;
      }
    });
  });
}

function rotate(matrix, dir) {
  for (let y=0; y<matrix.length; y++) {
    for (let x=0; x<y; x++) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
  if (dir > 0) matrix.forEach(row => row.reverse());
  else matrix.reverse();
}

function playerRotate(dir) {
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset>0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
  }
  dropCounter = 0;
}

function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) player.pos.x -= dir;
}

function playerReset() {
  const pieces = 'TJLOSZI';
  player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
  player.pos.y = 0;
  player.pos.x = (arenaWidth / 2 | 0) - (player.matrix[0].length / 2 | 0);
  if (collide(arena, player)) {
    arena = createMatrix(arenaWidth, arenaHeight);
    player.score = 0;
    updateScore();
  }
}

function arenaSweep() {
  let rowCount = 1;
  outer: for (let y = arena.length -1; y > 0; --y) {
    if (arena[y].every(val => val !== 0)) {
      arena.splice(y, 1);
      arena.unshift(new Array(arenaWidth).fill(0));
      player.score += rowCount * 10;
      rowCount *= 2;
      y++;
    }
  }
}

function updateScore() {
  scoreDiv.textContent = player.score;
}

// timing
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
function update(time = 0) {
  const delta = time - lastTime;
  dropCounter += delta;
  if (dropCounter > dropInterval) playerDrop();
  lastTime = time;
  draw();
  requestAnimationFrame(update);
}

// event listeners
document.addEventListener('keydown', event => {
  switch (event.code) {
    case 'ArrowLeft':  playerMove(-1); break;
    case 'ArrowRight': playerMove(1);  break;
    case 'ArrowDown':  playerDrop();    break;
    case 'KeyQ':       playerRotate(-1);break;
    case 'KeyW':       playerRotate(1); break;
    case 'Space':      playerRotate(1); break;
  }
});

// pieces
function createPiece(type) {
  const map = {
    I: [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]], // 4x4
    O: [[4,4],[4,4]], // 2x2
    L: [[0,2,0],[0,2,0],[0,2,2]], // 3x3
    J: [[0,3,0],[0,3,0],[3,3,0]], // 3x3
    Z: [[5,5,0],[0,5,5],[0,0,0]], // 3x3
    S: [[0,6,6],[6,6,0],[0,0,0]], // 3x3
    T: [[0,7,0],[7,7,7],[0,0,0]] // 3x3
  };
  return map[type];
}

// start
initGrid();
playerReset();
updateScore();
update();