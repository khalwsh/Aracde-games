const controlBtn = document.querySelector('.control-buttons span');
const splash   = document.querySelector('.control-buttons');
const nameSpan = document.querySelector('.name span');
const triesSpan= document.querySelector('.tries span');
const grid     = document.querySelector('.memory-game-blocks');
const duration = 800;

const images = [
  'a.png','b.avif','c.jpeg','d.jpeg','e.avif','f.jpg',
  'g.jpg','h.jpg','i.jpeg','j.webp','k.jpg','l.jpg'
];

// start Game
controlBtn.onclick = () => {
  const yourName = prompt("What's Your Name?");
  nameSpan.textContent = yourName?.trim() || 'Unknown';
  splash.remove();
  initGame();
};

function initGame() {
  // create a doubled (paired) array
  const cardList = [...images, ...images]
    .map(src => ({ src, id: Math.random() })) // unique dom-key

  // shuffle
  cardList.sort(() => Math.random() - .5);

  // render
  grid.innerHTML = cardList.map(card => `
    <div class="game-block" data-src="${card.src}" data-id="${card.id}">
      <div class="face front"></div>
      <div class="face back">
        <img src="imgs/${card.src}" alt="">
      </div>
    </div>
  `).join('');
  grid.classList.add('no-clicking');

  // after a short peek, enable clicking
  setTimeout(() => grid.classList.remove('no-clicking'), 1000);

  // bind clicks
  document.querySelectorAll('.game-block').forEach(block =>
    block.addEventListener('click', () => flip(block))
  );
}

let flipped = [];
function flip(block) {
  if (block.classList.contains('is-flipped') || block.classList.contains('has-match')) return;

  block.classList.add('is-flipped');
  flipped.push(block);

  if (flipped.length === 2) {
    grid.classList.add('no-clicking');

    const [a, b] = flipped;
    if (a.dataset.src === b.dataset.src) {
      // match
      setTimeout(() => {
        a.classList.add('has-match');
        b.classList.add('has-match');
        resetTurn();
      }, duration);
    } else {
      // no match
      triesSpan.textContent = +triesSpan.textContent + 1;
      setTimeout(() => {
        a.classList.remove('is-flipped');
        b.classList.remove('is-flipped');
        resetTurn();
      }, duration);
    }
  }
}

function resetTurn() {
  flipped = [];
  grid.classList.remove('no-clicking');
}
