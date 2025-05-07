let board = [];
let score = 0;
const rows = 4, cols = 4;

window.onload = () => {
  document.getElementById('reset').addEventListener('click', resetGame);
  resetGame();
};

function resetGame() {
  score = 0;
  board = Array(rows).fill().map(() => Array(cols).fill(0));
  updateScore();
  renderBoard();
  spawnTile();
  spawnTile();
}

function renderBoard() {
  const container = document.getElementById('board');
  container.innerHTML = ''; // clear old tiles
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.id = `tile-${r}-${c}`;
      const val = board[r][c];
      if (val) {
        tile.textContent = val;
        tile.classList.add(`x${val}`);
      }
      container.appendChild(tile);
      // trigger pop animation
      requestAnimationFrame(() => {
        tile.style.transform = 'scale(1)';
      });
    }
  }
}

function updateScore() {
  document.getElementById('score').textContent = score;
}

document.addEventListener('keyup', e => {
  let moved = false;
  switch (e.code) {
    case 'ArrowLeft':  moved = move('left');  break;
    case 'ArrowRight': moved = move('right'); break;
    case 'ArrowUp':    moved = move('up');    break;
    case 'ArrowDown':  moved = move('down');  break;
  }
  if (moved) {
    spawnTile();
    updateScore();
    renderBoard();
  }
});

function spawnTile() {
  const empties = [];
  board.forEach((row,r) =>
    row.forEach((v,c) => { if (!v) empties.push([r,c]); })
  );
  if (!empties.length) return;
  const [r, c] = empties[Math.floor(Math.random()*empties.length)];
  board[r][c] = 2;
  const tileEl = document.getElementById(`tile-${r}-${c}`);
  tileEl.classList.add('new');
}

function move(dir) {
  let moved = false;
  // build lines, slide & merge them, write back
  const getLine = i => {
    if (dir==='left')  return board[i].slice();
    if (dir==='right') return board[i].slice().reverse();
    if (dir==='up')    return board.map(r=>r[i]);
    if (dir==='down')  return board.map(r=>r[i]).reverse();
  };
  const setLine = (i, newLine) => {
    if (dir==='left')  board[i] = newLine;
    if (dir==='right') board[i] = newLine.reverse();
    if (dir==='up')    newLine.forEach((v,r)=>board[r][i]=v);
    if (dir==='down')  newLine.reverse().forEach((v,r)=>board[r][i]=v);
  };

  for (let i = 0; i < 4; i++) {
    const old = getLine(i);
    const slid = slide(old);
    setLine(i, slid);
    if (!moved && slid.some((v,j) => v !== old[j])) moved = true;
  }

  return moved;
}

function slide(arr) {
  const a = arr.filter(v=>v);
  for (let i = 0; i < a.length-1; i++) {
    if (a[i]===a[i+1]) {
      a[i]*=2;
      score += a[i];
      a[i+1]=0;
      const [r,c] = findTile(a[i], arr); // find merge pos
      const el = document.getElementById(`tile-${r}-${c}`);
      el && el.classList.add('merge');
    }
  }
  const merged = a.filter(v=>v);
  while (merged.length<4) merged.push(0);
  return merged;
}

// Helper: locate the recently merged tile in the old line
function findTile(val, oldArr) {
  for (let r=0; r<4; r++) {
    for (let c=0; c<4; c++) {
      if (oldArr[c]===val/2 && !board[r][c]) return [r,c];
    }
  }
  return [0,0];
}
