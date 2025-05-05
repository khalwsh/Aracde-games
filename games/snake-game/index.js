const GRID_SIZE = 21;

// generate random position to put food in
function randomGridPosition() {
  return { x: Math.floor(Math.random() * GRID_SIZE) + 1,
           y: Math.floor(Math.random() * GRID_SIZE) + 1 };
}

// input and last direction because if no input I will continue in same direction and new input must not make me turn 180 degree
let inputDirection = { x: 0, y: 0 };
let lastInputDirection = { x: 0, y: 0 };
window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp':
      if (lastInputDirection.y === 0) inputDirection = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (lastInputDirection.y === 0) inputDirection = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (lastInputDirection.x === 0) inputDirection = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (lastInputDirection.x === 0) inputDirection = { x: 1, y: 0 };
      break;
  }
});

function getInputDirection() {
  lastInputDirection = inputDirection;
  return inputDirection;
}

// SNAKE
const SNAKE_SPEED = 10;
const snakeBody = [{ x: 11, y: 11 }];
let newSegments = 0;

function updateSnake() {
  // grow
  for (let i = 0; i < newSegments; i++) {
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
  }
  newSegments = 0;

  // move
  const dir = getInputDirection();
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] };
  }
  snakeBody[0].x += dir.x;
  snakeBody[0].y += dir.y;

  // wrap
  if (snakeBody[0].x > GRID_SIZE) snakeBody[0].x = 1;
  if (snakeBody[0].x < 1)         snakeBody[0].x = GRID_SIZE;
  if (snakeBody[0].y > GRID_SIZE) snakeBody[0].y = 1;
  if (snakeBody[0].y < 1)         snakeBody[0].y = GRID_SIZE;
}

function drawSnake(board) {
  snakeBody.forEach(seg => {
    const el = document.createElement('div');
    el.style.gridRowStart = seg.y;
    el.style.gridColumnStart = seg.x;
    el.classList.add('snake');
    board.appendChild(el);
  });
}

function expandSnake(amount) {
  newSegments += amount;
}

function onSnake(pos, ignoreHead = false) {
  return snakeBody.some((seg, i) => {
    if (ignoreHead && i === 0) return false;
    return seg.x === pos.x && seg.y === pos.y;
  });
}

function snakeIntersection() {
  const head = snakeBody[0];
  return onSnake(head, true);
}

// FOOD
let food = randomGridPosition();
const EXPANSION_RATE = 1;

function updateFood() {
  if (onSnake(food)) {
    expandSnake(EXPANSION_RATE);
    food = randomGridPosition();
    return true;
  }
  return false;
}

function drawFood(board) {
  const el = document.createElement('div');
  el.style.gridRowStart = food.y;
  el.style.gridColumnStart = food.x;
  el.classList.add('food');
  board.appendChild(el);
}

//  GAME LOOP 
const gameBoard = document.getElementById('game-board');
const scoreEl   = document.getElementById('score');
let lastRender  = 0;
let gameOver    = false;
let score       = 0;

window.requestAnimationFrame(main);
function main(time) {
  if (gameOver) {
    if (confirm('You lost. Press OK to restart.')) window.location.reload();
    return;
  }
  window.requestAnimationFrame(main);
  const secs = (time - lastRender) / 1000;
  if (secs < 1 / SNAKE_SPEED) return;
  lastRender = time;

  // update
  updateSnake();
  if (updateFood()) {
    score += EXPANSION_RATE;
    scoreEl.textContent = `Score: ${score}`;
  }
  if (snakeIntersection()) gameOver = true;

  // draw
  gameBoard.innerHTML = '';
  drawSnake(gameBoard);
  drawFood(gameBoard);
}