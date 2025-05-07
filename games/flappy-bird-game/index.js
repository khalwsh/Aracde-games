const board = document.getElementById("board");
const boardWidth = 360;
const boardHeight = 640;
const context = board.getContext("2d");
board.width = boardWidth;
board.height = boardHeight;

const birdImg = new Image();
birdImg.src = "resources/flappybird.png";

const bird = {
    width: 34,             // aspect ratio roughly 17:12
    height: 24,
    x: boardWidth / 8,
    y: boardHeight / 2,
    velocityY: 0
};

const pipeWidth = 64;     // aspect ratio roughly 1:8
const pipeHeight = 512;
const pipeGap = boardHeight / 4;
const pipeSpeed = -2;

const topPipeImg = new Image();
topPipeImg.src = "resources/toppipe.png";

const bottomPipeImg = new Image();
bottomPipeImg.src = "resources/bottompipe.png";

let pipes = [];

const gravity = 0.4;
let gameOver = false;
let score = 0;

window.onload = () => {
    // start the bird drawing once its image loads
    birdImg.onload = () => drawBird();

    // input listener
    document.addEventListener("keydown", handleInput);

    // spawn pipes every 1.5s
    setInterval(placePipePair, 1500);

    // start the loop
    requestAnimationFrame(update);
};

function update() {
    // always schedule the next frame
    requestAnimationFrame(update);

    // clear the canvas
    context.clearRect(0, 0, boardWidth, boardHeight);

    if (!gameOver) {
    // game logic & drawing
    applyGravity();
    drawBird();
    moveAndDrawPipes();
    drawScore();
    checkCollisions();
    } else {
    // draw final frame (so game objects don’t vanish)
    drawBird();
    pipes.forEach(pipe =>
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height)
    );
    drawScore();
    context.fillStyle = "#fff";
    context.font = "45px sans-serif";
    context.fillText("GAME OVER", 5, 90);
    }
}

function applyGravity() {
    bird.velocityY += gravity;
    bird.y = Math.max(0, bird.y + bird.velocityY);
}

function drawBird() {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function moveAndDrawPipes() {
    pipes.forEach(pipe => {
    pipe.x += pipeSpeed;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
        score += 0.5;  // each pair yields 1 full point
        pipe.passed = true;
    }
    });

    // remove off-screen pipes
    pipes = pipes.filter(pipe => pipe.x + pipe.width >= 0);
}

function drawScore() {
    context.fillStyle = "#fff";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);
}

function checkCollisions() {
    const hitGround = bird.y > boardHeight;
    const hitPipe = pipes.some(pipe => detectCollision(bird, pipe));
    if (hitGround || hitPipe) gameOver = true;
}

function placePipePair() {
    if (gameOver) return;

    const maxOffset = pipeHeight / 2;
    const yOffset = -pipeHeight / 4 - Math.random() * maxOffset;
    const topY = yOffset;
    const bottomY = yOffset + pipeHeight + pipeGap;

    pipes.push(
    { img: topPipeImg, x: boardWidth, y: topY, width: pipeWidth, height: pipeHeight, passed: false },
    { img: bottomPipeImg, x: boardWidth, y: bottomY, width: pipeWidth, height: pipeHeight, passed: false }
    );
}

function handleInput(e) {
    if (!["Space", "ArrowUp", "KeyX"].includes(e.code)) return;

    if (gameOver) {
    // reset state
    bird.y = boardHeight / 2;
    bird.velocityY = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    }

    // make the bird jump
    bird.velocityY = -6;
}

function detectCollision(a, b) {
    return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
    );
}