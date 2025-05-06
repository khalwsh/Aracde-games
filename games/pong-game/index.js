const container  = document.getElementById('gameContainer');
const paddle1    = document.getElementById('paddle1');
const paddle2    = document.getElementById('paddle2');
const ball       = document.getElementById('ball');
const scoreText  = document.getElementById('scoreText');
const resetBtn   = document.getElementById('resetBtn');

const cw = container.clientWidth;
const ch = container.clientHeight;
const paddleSpeed = 8;

let p1Y = (ch - 80) / 2;
let p2Y = (ch - 80) / 2;
let bX = cw / 2 - 10;
let bY = ch / 2 - 10;
let bDX = 4;
let bDY = 2;
let score1 = 0;
let score2 = 0;

const keys = {};  // track which keys are down
let anim;

// update paddle positions based on keys pressed
function movePaddles() {
  if (keys['w']    && p1Y > 0)           p1Y -= paddleSpeed;
  if (keys['s']    && p1Y < ch - 80)     p1Y += paddleSpeed;
  if (keys['ArrowUp']   && p2Y > 0)      p2Y -= paddleSpeed;
  if (keys['ArrowDown'] && p2Y < ch - 80) p2Y += paddleSpeed;
}

function draw() {
  paddle1.style.top = p1Y + 'px';
  paddle2.style.top = p2Y + 'px';
  ball.style.transform = `translate(${bX}px, ${bY}px)`;
}

function update() {
  movePaddles();

  // move ball
  bX += bDX;
  bY += bDY;

  // top/bottom bounce
  if (bY <= 0 || bY >= ch - 20) bDY *= -1;

  // left paddle collision
  if (bX <= 25 && bY + 10 >= p1Y && bY <= p1Y + 80) {
    bDX *= -1.1;
    bX = 25;
  }

  // right paddle collision
  if (bX + 20 >= cw - 25 && bY + 10 >= p2Y && bY <= p2Y + 80) {
    bDX *= -1.1;
    bX = cw - 45;
  }

  // score update
  if (bX < 0) { score2++; resetBall(); }
  if (bX > cw) { score1++; resetBall(); }
  scoreText.textContent = `${score1} : ${score2}`;
}

function resetBall() {
  bX = cw / 2 - 10;
  bY = ch / 2 - 10;
  bDX = (Math.random() > 0.5 ? 4 : -4);
  bDY = (Math.random() * 4 - 2);
}

function loop() {
  update();
  draw();
  anim = requestAnimationFrame(loop);
}

// key handlers
window.addEventListener('keydown', e => {
  keys[e.key] = true;
});

window.addEventListener('keyup', e => {
  keys[e.key] = false;
});

resetBtn.addEventListener('click', () => {
  score1 = 0;
  score2 = 0;
  p1Y = p2Y = (ch - 80) / 2;
  resetBall();
});

// start
resetBall();
loop();
