let gameBoard;
let playerElem;
let ballElem;
let scoreElem;
let gameOverElem;

let boardWidth = 500;
let boardHeight = 500;

let playerWidth = 80;
let playerHeight = 10;
let playerVelocityX = 25;

let player = {
    x: boardWidth / 2 - playerWidth / 2,
    y: boardHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight,
    velocityX: playerVelocityX
};

let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3;
let ballVelocityY = 2;

let ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY
};

let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 8;
let blockRows = 3;
let blockMaxRows = 10;
let blockCount = 0;

let blockX = 15;
let blockY = 45;

let score = 0;
let gameOver = false;

window.onload = function() {
    gameBoard = document.getElementById("game-board");
    playerElem = document.getElementById("player");
    ballElem = document.getElementById("ball");
    scoreElem = document.getElementById("score");
    gameOverElem = document.getElementById("game-over");

    playerElem.style.left = player.x + "px";
    playerElem.style.top = player.y + "px";
    playerElem.style.width = player.width + "px";
    playerElem.style.height = player.height + "px";

    ballElem.style.left = ball.x + "px";
    ballElem.style.top = ball.y + "px";
    ballElem.style.width = ball.width + "px";
    ballElem.style.height = ball.height + "px";

    createBlocks();

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);
};

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    ballElem.style.left = ball.x + "px";
    ballElem.style.top = ball.y + "px";

    if (ball.y <= 0) {
        ball.velocityY *= -1;
    } else if (ball.x <= 0 || ball.x + ball.width >= boardWidth) {
        ball.velocityX *= -1;
    } else if (ball.y + ball.height >= boardHeight) {
        gameOver = true;
        gameOverElem.style.display = "block";
        return;
    }

    if (detectCollision(ball, player)) {
        if (ball.y + ball.height >= player.y) {
            ball.velocityY *= -1;
        } else if (ball.x + ball.width >= player.x && ball.x <= player.x + player.width) {
            ball.velocityX *= -1;
        }
    }

    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];
        if (!block.break && detectCollision(ball, block)) {
            block.break = true;
            ball.velocityY *= -1;
            score += 100;
            blockCount -= 1;
            gameBoard.removeChild(block.elem);
            scoreElem.innerText = score;
        }
    }

    if (blockCount == 0) {
        score += 100 * blockRows * blockColumns;
        scoreElem.innerText = score;
        blockRows = Math.min(blockRows + 1, blockMaxRows);
        createBlocks();
    }
}

function movePlayer(e) {
    if (gameOver) {
        if (e.code == "Space") {
            resetGame();
        }
        return;
    }
    if (e.code == "ArrowLeft") {
        let nextX = player.x - player.velocityX;
        if (nextX >= 0) {
            player.x = nextX;
            playerElem.style.left = player.x + "px";
        }
    } else if (e.code == "ArrowRight") {
        let nextX = player.x + player.velocityX;
        if (nextX + player.width <= boardWidth) {
            player.x = nextX;
            playerElem.style.left = player.x + "px";
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function createBlocks() {
    blockArray = [];
    for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
            let block = {
                x: blockX + c * blockWidth + c * 10,
                y: blockY + r * blockHeight + r * 10,
                width: blockWidth,
                height: blockHeight,
                break: false,
                elem: document.createElement("div")
            };
            block.elem.className = "brick";
            block.elem.style.left = block.x + "px";
            block.elem.style.top = block.y + "px";
            block.elem.style.width = block.width + "px";
            block.elem.style.height = block.height + "px";
            gameBoard.appendChild(block.elem);
            blockArray.push(block);
        }
    }
    blockCount = blockArray.length;
}

function resetGame() {
    gameOver = false;
    gameOverElem.style.display = "none";
    player.x = boardWidth / 2 - playerWidth / 2;
    player.y = boardHeight - playerHeight - 5;
    playerElem.style.left = player.x + "px";
    playerElem.style.top = player.y + "px";
    ball.x = boardWidth / 2;
    ball.y = boardHeight / 2;
    ballElem.style.left = ball.x + "px";
    ballElem.style.top = ball.y + "px";
    ball.velocityX = ballVelocityX;
    ball.velocityY = ballVelocityY;
    blockArray.forEach(block => {
        if (block.elem.parentNode) {
            block.elem.parentNode.removeChild(block.elem);
        }
    });
    blockArray = [];
    blockRows = 3;
    score = 0;
    scoreElem.innerText = score;
    createBlocks();
}