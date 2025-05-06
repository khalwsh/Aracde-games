const rows = 8, cols = 8, minesCount = 10;
    let board = [], mines = new Set(), clicked = 0, gameOver = false;
    let timerInterval, time = 0;

    const minesSpan = document.getElementById('mines-count');
    const timerSpan = document.getElementById('timer');
    const restartBtn = document.getElementById('restart');
    const boardEl = document.getElementById('board');

    function init() {
      // reset
      board = []; mines.clear(); clicked = 0; time = 0; gameOver = false;
      clearInterval(timerInterval);
      minesSpan.textContent = minesCount;
      timerSpan.textContent = '0';
      boardEl.innerHTML = '';

      // place mines
      while (mines.size < minesCount) {
        mines.add(`${Math.floor(Math.random()*rows)}-${Math.floor(Math.random()*cols)}`);
      }
      
      // build board
      for (let r=0; r<rows; r++) {
        let row = [];
        for (let c=0; c<cols; c++) {
          const tile = document.createElement('div');
          tile.classList.add('tile'); tile.id = `${r}-${c}`;
          tile.oncontextmenu = e => { e.preventDefault(); flag(tile); };
          tile.onclick = () => clickTile(tile);
          boardEl.append(tile);
          row.push(tile);
        }
        board.push(row);
      }

      // start timer
      timerInterval = setInterval(() => timerSpan.textContent = ++time, 1000);
    }

    function flag(tile) {
      if (gameOver || tile.classList.contains('tile-clicked')) return;
      tile.textContent = tile.textContent === '🚩' ? '' : '🚩';
      tile.classList.toggle('flag');
      const shownFlags = Array.from(document.getElementsByClassName('flag')).length;
      minesSpan.textContent = minesCount - shownFlags;
    }

    function clickTile(tile) {
      if (gameOver || tile.classList.contains('tile-clicked') || tile.textContent==='🚩') return;
      const [r,c] = tile.id.split('-').map(Number);
      if (mines.has(tile.id)) return endGame(false);

      reveal(r,c);
      if (clicked === rows*cols - minesCount) endGame(true);
    }

    function reveal(r,c) {
      if (r<0||r>=rows||c<0||c>=cols) return;
      const tile = board[r][c];
      if (tile.classList.contains('tile-clicked')) return;
      tile.classList.add('tile-clicked'); clicked++;
      let count = 0;
      for (let i=-1; i<=1; i++) for (let j=-1; j<=1; j++) if (mines.has(`${r+i}-${c+j}`)) count++;
      if (count) {
        tile.textContent = count; tile.classList.add('x'+count);
      } else {
        for (let i=-1; i<=1; i++) for (let j=-1; j<=1; j++) reveal(r+i,c+j);
      }
    }

    function endGame(win) {
      gameOver = true; clearInterval(timerInterval);
      // reveal all
      board.flat().forEach(tile => {
        if (mines.has(tile.id)) {
          tile.textContent = '💣'; tile.classList.add('bomb');
        }
      });
      setTimeout(()=>alert(win? 'You Win!' : 'Game Over!'),100);
    }

    restartBtn.onclick = init;
    window.onload = init;