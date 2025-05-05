const options = ['rock', 'paper', 'scissors'];
let playerScore = 0, computerScore = 0;

const playerDisplay   = document.getElementById('player-display');
const computerDisplay = document.getElementById('computer-display');
const resultText      = document.getElementById('result-text');
const playerScoreEl   = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');
const resetBtn        = document.getElementById('reset');
const choiceBtns      = document.querySelectorAll('.choice-btn');

function cycleHands(displayEl, duration = 800, interval = 100) {
  return new Promise(resolve => {
    let elapsed = 0;
    const timer = setInterval(() => {
      const randomChoice = options[Math.floor(Math.random() * options.length)];
      displayEl.src = `images/${randomChoice}.png`;
      elapsed += interval;
      if (elapsed >= duration) {
        clearInterval(timer);
        resolve();  // stop cycling
      }
    }, interval);
  });
}

async function playSimulation(playerChoice) {
  // 1) cycle both hands
  await Promise.all([
    cycleHands(playerDisplay),
    cycleHands(computerDisplay)
  ]);

  // 2) lock in final images
  playerDisplay.src   = `images/${playerChoice}.png`;
  const computerChoice = options[Math.floor(Math.random() * options.length)];
  computerDisplay.src = `images/${computerChoice}.png`;

  // 3) decide winner
  if (playerChoice === computerChoice) {
    resultText.textContent = `Tie! You both chose ${playerChoice}.`;
  } else if (
    (playerChoice === 'rock'     && computerChoice === 'scissors') ||
    (playerChoice === 'paper'    && computerChoice === 'rock')     ||
    (playerChoice === 'scissors' && computerChoice === 'paper')
  ) {
    playerScore++;
    resultText.textContent = `You win! ${playerChoice} beats ${computerChoice}.`;
  } else {
    computerScore++;
    resultText.textContent = `You lose! ${computerChoice} beats ${playerChoice}.`;
  }
  updateScores();
}

function updateScores() {
  playerScoreEl.textContent   = playerScore;
  computerScoreEl.textContent = computerScore;
}

choiceBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    resultText.textContent = '…Rock, Paper, Scissors…';
    playSimulation(btn.dataset.choice);
  });
});

resetBtn.addEventListener('click', () => {
  playerScore = computerScore = 0;
  updateScores();
  resultText.textContent = 'Make your move!';
  playerDisplay.src   = 'images/rock.png';
  computerDisplay.src = 'images/rock.png';
});
