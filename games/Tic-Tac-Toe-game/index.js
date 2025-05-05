const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('#statusText');
const restartBtn = document.querySelector('#restartBtn');
const twoPlayerBtn = document.querySelector('#twoPlayerBtn');
const aiBtn = document.querySelector('#aiBtn');
const modeSelection = document.querySelector('#modeSelection');
const boardArea = document.querySelector('#boardArea');

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

let options = Array(9).fill('');
let currentPlayer = 'X';
let running = false;
let mode = '2P'; // '2P' or 'AI'

// Mode setup
twoPlayerBtn.addEventListener('click', () => startGame('2P'));
aiBtn.addEventListener('click', () => startGame('AI'));
restartBtn.addEventListener('click', restartGame);

function startGame(selectedMode) {
  mode = selectedMode;
  modeSelection.classList.add('hidden');
  boardArea.classList.remove('hidden');
  restartBtn.classList.remove('hidden');
  statusText.textContent = `${currentPlayer}'s turn`;
  running = true;
  if (mode === 'AI' && currentPlayer === 'O') {
    aiMove();
  }
}

function cellClicked() {
  const idx = this.getAttribute('cellIndex');
  if (options[idx] !== '' || !running) return;
  updateCell(this, idx);
  checkWinner();
  if (running && mode === 'AI' && currentPlayer === 'O') {
    setTimeout(aiMove, 100);
  }
}

function updateCell(cell, idx) {
  options[idx] = currentPlayer;
  cell.textContent = currentPlayer;
}

function changePlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
  let win = false;
  for (const condition of winConditions) {
    const [a,b,c] = condition;
    if (options[a] === '' || options[b] === '' || options[c] === '') continue;
    if (options[a] === options[b] && options[b] === options[c]) {
      win = true; break;
    }
  }
  if (win) {
    statusText.textContent = `${currentPlayer} wins!`;
    running = false;
  } else if (!options.includes('')) {
    statusText.textContent = 'Draw!';
    running = false;
  } else {
    changePlayer();
  }
}

function restartGame() {
  options.fill('');
  cells.forEach(cell => cell.textContent = '');
  currentPlayer = 'X';
  statusText.textContent = `${currentPlayer}'s turn`;
  running = true;
}

// AI using Minimax algorithm to choose the best option (I can dp on it but backtracking is good we have grid 3 * 3 so we have only 2 ^ 9 options which is 512 so easy)
function aiMove() {
  const best = minimax(options, 'O');
  const idx = best.index;
  const cell = document.querySelector(`.cell[cellIndex='${idx}']`);
  updateCell(cell, idx);
  checkWinner();
}

function minimax(board, player) {
  const avail = board.map((v,i) => v === '' ? i : null).filter(i => i !== null);
  // base case
  if (checkWin(board, 'X')) return {score: -1};
  if (checkWin(board, 'O')) return {score: 1};
  if (avail.length === 0) return {score: 0};

  const moves = [];
  for (const idx of avail) {
    const newBoard = board.slice();
    newBoard[idx] = player;
    const result = minimax(newBoard, player === 'O' ? 'X' : 'O');
    moves.push({index: idx, score: result.score});
  }

  // transation
  let bestMove;
  if (player === 'O') {
    let max = -Infinity;
    for (const m of moves) {
      if (m.score > max) { max = m.score; bestMove = m; }
    }
  } else {
    let min = Infinity;
    for (const m of moves) {
      if (m.score < min) { min = m.score; bestMove = m; }
    }
  }
  return bestMove;
}

function checkWin(board, player) {
  return winConditions.some(cond =>
    cond.every(i => board[i] === player)
  );
}

// add the event listener to all cells
cells.forEach(cell => cell.addEventListener('click', cellClicked));
