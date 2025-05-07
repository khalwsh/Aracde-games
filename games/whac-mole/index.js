let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = false;
let timer = 30; // 30 seconds countdown
let moleTimer, plantTimer, countdownTimer;

const hitSound = new Audio("sounds/hit.mp3");
const missSound = new Audio("sounds/miss.mp3");
const gameoverSound = new Audio("sounds/gameover.mp3");

window.onload = function () {
    setGame();
};

function setGame() {
    const board = document.getElementById("board");
    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        board.appendChild(tile);
    }

    moleTimer = setInterval(setMole, 1000);
    plantTimer = setInterval(setPlant, 1500);
    countdownTimer = setInterval(updateTimer, 1000);
}

function getRandomTile() {
    return Math.floor(Math.random() * 9).toString();
}

function setMole() {
    if (gameOver) return;
    if (currMoleTile) currMoleTile.innerHTML = "";

    let num = getRandomTile();
    if (currPlantTile && currPlantTile.id === num) return;

    let mole = document.createElement("img");
    mole.src = "images/monty-mole.png";
    mole.classList.add("active");
    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);
}

function setPlant() {
    if (gameOver) return;
    if (currPlantTile) currPlantTile.innerHTML = "";

    let num = getRandomTile();
    if (currMoleTile && currMoleTile.id === num) return;

    let plant = document.createElement("img");
    plant.src = "images/piranha-plant.png";
    plant.classList.add("active");
    currPlantTile = document.getElementById(num);
    currPlantTile.appendChild(plant);
}

function selectTile() {
    if (gameOver) return;

    if (this === currMoleTile) {
        hitSound.play();
        score += 10;
        document.getElementById("score").innerText = "Score: " + score;
        currMoleTile.innerHTML = "";
    } else if (this === currPlantTile) {
        missSound.play();
        endGame();
    }
}

function updateTimer() {
    timer--;
    if (timer <= 0) {
        endGame();
    }
}

function endGame() {
    gameOver = true;
    clearInterval(moleTimer);
    clearInterval(plantTimer);
    clearInterval(countdownTimer);

    gameoverSound.play();
    document.getElementById("score").innerText = "Game Over! Score: " + score;

    let restartBtn = document.createElement("button");
    restartBtn.innerText = "Restart";
    restartBtn.id = "restart";
    restartBtn.onclick = () => location.reload();
    document.body.appendChild(restartBtn);
    restartBtn.style.display = "block";
}
